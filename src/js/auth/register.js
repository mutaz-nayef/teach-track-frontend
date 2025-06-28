import { register } from "../auth/auth.js";
import NProgress from "nprogress";

import { startRouter } from "../router.js";

import "nprogress/nprogress.css";

const registerForm = document.getElementById("registerForm");

async function fetchAndReplaceBody(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  document.body.innerHTML = doc.body.innerHTML;
}

async function fetchAndInjectMainContent(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const html = await res.text();
  const mainContent = document.getElementById("main-content");
  if (!mainContent) throw new Error("#main-content not found");
  mainContent.innerHTML = html;
}

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password_confirmation = e.target.password_confirmation.value;

    try {
      NProgress.start();
      await register(name, email, password, password_confirmation);

      try {
        await fetchAndReplaceBody("/index.html");
        await fetchAndInjectMainContent("pages/dashboard");
      } catch (pageErr) {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.innerHTML = `<p>⚠️ Failed to load page</p>`;
        }
        console.error("Page load error:", pageErr);
      }

      NProgress.done();
    } catch (err) {
      NProgress.done();

      console.log(err);
    }
  });
} else {
  console.warn("⚠️ registerForm not found in the DOM.");
}
