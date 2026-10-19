(() => {
  "use strict";

  const storageKey = "bi-en-claro-theme";
  const buttons = document.querySelectorAll("[data-theme-toggle]");

  function savedTheme() {
    try {
      return localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  }

  function applyTheme(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === "dark";

    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", `Cambiar a tema ${isDark ? "claro" : "oscuro"}`);
      button.title = `Cambiar a tema ${isDark ? "claro" : "oscuro"}`;
      button.querySelector(".theme-toggle-icon").textContent = isDark ? "☼" : "☾";
      button.querySelector("[data-theme-label]").textContent = isDark ? "Claro" : "Oscuro";
    });

    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // El tema sigue funcionando aunque el almacenamiento esté bloqueado.
      }
    }

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  applyTheme(savedTheme());
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) applyTheme(event.newValue === "dark" ? "dark" : "light");
  });
})();