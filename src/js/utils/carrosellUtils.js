// ==========================
// CARROSSEL BANNER (UTIL)
// ==========================

let bannerInterval = null;

export function iniciarCarouselBanner() {
  const wrapper = document.getElementById("carousel-wrapper");
  const dots = Array.from(document.querySelectorAll(".dot"));

  if (!wrapper || !dots.length) return;

  const slides = Array.from(wrapper.children);
  const total = slides.length;

  let index = 0;

  if (wrapper.dataset.init === "true") return;
  wrapper.dataset.init = "true";

  wrapper.style.transform = "translateX(0)";

  function render(animate = true) {
    wrapper.style.transition = animate ? "transform .6s ease" : "none";
    wrapper.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d) => d.classList.remove("active"));
    dots[index % total].classList.add("active");
  }

  function next() {
    index++;

    if (index >= total) {
      index = 0;
      render(false);
    }

    render(true);
  }

  function startAuto() {
    stopAuto();
    bannerInterval = setInterval(next, 4000);
  }

  function stopAuto() {
    if (bannerInterval) clearInterval(bannerInterval);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      render();
      startAuto();
    });
  });

  const btnPrev = document.querySelector(".carousel-btn.prev");
  const btnNext = document.querySelector(".carousel-btn.next");

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      index--;
      if (index < 0) index = total - 1;
      render();
      startAuto();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      next();
      startAuto();
    });
  }

  wrapper.addEventListener("mouseenter", stopAuto);
  wrapper.addEventListener("mouseleave", startAuto);

  render();
  startAuto();
}
