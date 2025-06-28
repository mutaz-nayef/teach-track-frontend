import "../style/style.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { startRouter } from "./router.js";

import { initSidebar } from "./sidebar.js";

// ✅ Main App Init
document.addEventListener("DOMContentLoaded", async () => {
  initSidebar();
  startRouter();

  // Hamburger toggle after header is loaded
  const navToggle = document.querySelector('[aria-controls="primary-side"]');
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      document.body.classList.toggle("sidebar-open", !expanded);
    });
  }
});

NProgress.start();
NProgress.done();

document.addEventListener("load", function () {
  NProgress.done();
});

document.addEventListener("page:fetch", function () {
  NProgress.start();
});

document.addEventListener("page:change", function () {
  NProgress.done();
});

document.addEventListener("page:restore", function () {
  NProgress.remove(); // Not part of official NProgress API unless you added it
});
