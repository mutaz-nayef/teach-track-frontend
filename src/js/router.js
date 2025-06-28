import Navigo from "navigo";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { isAuthenticated, logout } from "./auth/auth.js";
import { state } from "./state.js";

const router = new Navigo("/", {
  // disable trailing slash strictness to avoid mismatch
  strict: false,
  // or try hash routing as a test
  hash: false,
});
const mainContent = document.getElementById("main-content");

// Public route for login
router.on("/login", async () => {
  if (isAuthenticated()) {
    router.navigate("/"); // Redirect to main page
    return;
  }

  NProgress.start();

  try {
    const res = await fetch("/pages/auth/login.html");
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Replace body content
    document.body.innerHTML = doc.body.innerHTML;
    await import("/src/js/auth/login.js");
    router.updatePageLinks();
    router.navigate("/");
  } catch (err) {
    document.getElementById(
      "main-content"
    ).innerHTML = `<p>⚠️ Failed to load page</p>`;
    console.error("Login page load error:", err);
  }

  NProgress.done();
});

router.on("/register", async () => {
  if (isAuthenticated()) {
    router.navigate("/"); // Redirect to main page
    return;
  }

  NProgress.start();

  try {
    const res = await fetch("/pages/auth/register.html");
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Replace body content
    document.body.innerHTML = doc.body.innerHTML;
    await import("/src/js/auth/register.js");
    router.updatePageLinks();
    router.navigate("/");
  } catch (err) {
    document.getElementById(
      "main-content"
    ).innerHTML = `<p>⚠️ Failed to load page</p>`;
    console.error("Login page load error:", err);
  }

  NProgress.done();
});

router.on("/logout", async () => {
  if (!isAuthenticated()) {
    router.navigate("/login"); // Redirect to main page
    return;
  }
  try {
    NProgress.start();
    const res = await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Logout Failed");
    }
    state.clearAuth();
    router.navigate("/login"); // Redirect to main page
  } catch (e) {
    NProgress.done();

    throw e;
  }
  NProgress.done();
});

router.on("/", routePage("/pages/dashboard")); // example: protected home
router.on("/students", routePage("/pages/students/index")); // example: protected home
router.on("/students/create", routePage("/pages/students/create")); // example: protected home
router.on("/students/imported", routePage("/pages/students/imported")); // example: protected home

router.notFound(() => {
  mainContent.innerHTML = "<h1>404 - Not Found</h1>";
});

// This function will handle the fetching of the HTML and importing the JS for each page.
function routePage(path) {
  return async () => {
    console.log("Routing to:", path);
    if (!isAuthenticated()) {
      router.navigate("/login");
    } else {
      await fetchData(`${path}.html`);
      await loadPageScript(path);
      router.updatePageLinks();
    }
  };
}

async function fetchData(url) {
  NProgress.start();
  try {
    const res = await fetch(url);

    const html = await res.text();

    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.innerHTML = html;
  } catch (err) {
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.innerHTML = `<p>⚠️ Failed to load page</p>`;
  }
  NProgress.done();
}

// This function will dynamically import the appropriate JavaScript for each page.
async function loadPageScript(path) {
  try {
    if (path === "/pages/students/index") {
      await import("/src/js/students/index.js"); // Import JS for the students index page
    } else if (path === "/pages/students/create") {
      await import("/src/js/students/create.js"); // Import JS for the students create page
    } else if (path === "/pages/students/imported") {
      await import("/src/js/students/imported.js"); // Import JS for the students imported page
    }
    // Add more routes with their JS imports as needed
  } catch (error) {
    console.error("Error loading script for page:", path, error);
  }
}

export function startRouter() {
  router.resolve();
}

/*
  window.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = isAuthenticated();

    // redirect manually on load based on state
    if (isLoggedIn && location.pathname === "/") {
      router.navigate("/"); // or whatever your main page is
    }

    // start the router
    router.resolve();
  });
*/
