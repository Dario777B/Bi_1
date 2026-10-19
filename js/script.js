(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".slide")];
  const previousButton = document.getElementById("previousSlide");
  const nextButton = document.getElementById("nextSlide");
  const slideCount = document.getElementById("slideCount");
  const slideTitle = document.getElementById("slideTitle");
  const progress = document.getElementById("deckProgress");
  const progressFill = document.getElementById("progressFill");
  const dotsContainer = document.getElementById("slideDots");

  if (slides.length === 0) return;

  let activeIndex = 0;

  // Construye puntos navegables desde las diapositivas declaradas en el HTML.
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("aria-label", `Ir a la diapositiva ${index + 1}: ${slide.dataset.title}`);
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.append(dot);
  });

  const dots = [...dotsContainer.querySelectorAll(".slide-dot")];

  function showSlide(index, updateHash = true) {
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const previousIndex = activeIndex;
    activeIndex = nextIndex;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.classList.toggle("is-leaving-back", slideIndex === previousIndex && activeIndex < previousIndex);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });

    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;
    slideCount.innerHTML = `${String(activeIndex + 1).padStart(2, "0")} <i>/</i> ${String(slides.length).padStart(2, "0")}`;
    slideTitle.textContent = slides[activeIndex].dataset.title.toLocaleUpperCase("es");
    progressFill.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
    progress.setAttribute("aria-valuenow", String(activeIndex + 1));

    if (updateHash && window.location.hash !== `#slide-${activeIndex + 1}`) {
      window.history.replaceState(null, "", `#slide-${activeIndex + 1}`);
    }
  }

  function goToHash() {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (match) showSlide(Number(match[1]) - 1, false);
  }

  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && event.target.matches("input, textarea, select, [contenteditable='true']")) return;

    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1);
    }
  });

  window.addEventListener("hashchange", goToHash);
  goToHash();
  showSlide(activeIndex);
})();
