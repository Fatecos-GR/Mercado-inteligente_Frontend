let slideIndex = 0;
const slides = document.getElementsByClassName("banner-item");
const dots = document.getElementsByClassName("dot");

function showSlides(n) {
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }

  // Esconde todos os slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
    dots[i].classList.remove("active");
  }

  // Mostra o slide atual
  slides[slideIndex].classList.add("active");
  dots[slideIndex].classList.add("active");
}

function moveSlide(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

// Mudar automaticamente a cada 5 segundos
setInterval(() => {
  moveSlide(1);
}, 5000);
