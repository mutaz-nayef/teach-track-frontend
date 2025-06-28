// sidebar.js

export function initSidebar() {
  const contentDiv = document.getElementById("main-content");
  let currentPath = window.location.pathname + window.location.search;

  // Setup navigation link click handlers
  document.querySelectorAll("a[data-navigo]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveLink(link);
    });
  });

  // Setup submenu toggle click
  document.querySelectorAll(".toggle-sub-menu").forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const submenu = this.closest(".list-menu")?.querySelector(".sub-menu");
      submenu?.classList.toggle("open");
    });
  });

  // Initial active link highlight
  highlightCurrentLink(currentPath);
}

// --- Helper functions ---
function setActiveLink(clickedLink) {
  document.querySelectorAll(".links li").forEach((li) => {
    li.classList.remove("active");
  });
  clickedLink.closest("li")?.classList.add("active");
}

function highlightCurrentLink(path) {
  const links = Array.from(document.querySelectorAll(".links a[data-url]"));

  const activeLink = links.find((link) => {
    try {
      const fullUrl = new URL(
        link.getAttribute("data-navigo"),
        window.location.origin
      );
      return fullUrl.pathname + fullUrl.search === path;
    } catch {
      return false;
    }
  });

  if (activeLink) {
    setActiveLink(activeLink);
  }
}
