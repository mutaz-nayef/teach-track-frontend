import { login } from "../auth/auth.js";
import NProgress from "nprogress";

import { startRouter } from "../router.js";

import "nprogress/nprogress.css";

const loginForm = document.getElementById("loginForm");

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

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      NProgress.start();
      await login(email, password);

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
  console.warn("⚠️ loginForm not found in the DOM.");
}
