import { produtosMock } from "../data/produtosMock.js";
import { atualizarCarrinhoHeader, mostrarToastProduto } from "../components/headerClient.js";

// ==========================
// INICIALIZAÇÃO DE PÁGINA
// ==========================

export function iniciarHome() {
  iniciarCarouselBanner();
  iniciarTabsRecomendacoes();
  iniciarScrollCategorias();
  iniciarNavegacaoCategorias();
  iniciarBotoesCarrinho();
}

// ==========================
// ADICIONAR AO CARRINHO
// ==========================
function iniciarBotoesCarrinho() {
  const botoesAdd = document.querySelectorAll(".btn-add-cart");
  
  botoesAdd.forEach(botao => {
    botao.addEventListener("click", (e) => {
      e.preventDefault();
      const produtoId = botao.getAttribute("data-id");
      if (!produtoId) return;

      const produtoEncontrado = produtosMock.find(p => p.id === produtoId);
      if (!produtoEncontrado) return;

      let carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];
      const indexExistente = carrinho.findIndex(item => item.id === produtoId);

      if (indexExistente >= 0) {
        carrinho[indexExistente].quantidade += 1;
      } else {
        carrinho.push({
          id: produtoEncontrado.id,
          nome: produtoEncontrado.nome,
          preco: produtoEncontrado.preco,
          imagem: produtoEncontrado.imagem,
          quantidade: 1
        });
      }

      localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));
      
      // Feedback visual simples
      const icon = botao.querySelector("i");
      if (icon) {
        botao.innerHTML = 'Adicionado <i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          botao.innerHTML = 'Adicionar <i class="fa-solid fa-cart-shopping"></i>';
        }, 1500);
      }

      atualizarCarrinhoHeader();
      mostrarToastProduto(produtoEncontrado.nome);
    });
  });
}

// ==========================
// NAVEGAÇÃO DE CATEGORIAS (Setas)
// ==========================
function iniciarNavegacaoCategorias() {
  const wrapper = document.getElementById("categories-wrapper");
  const btnPrev = document.getElementById("cat-prev");
  const btnNext = document.getElementById("cat-next");

  if (!wrapper || !btnPrev || !btnNext) return;

  const scrollAmount = 300;

  btnNext.addEventListener("click", () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  btnPrev.addEventListener("click", () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
}

// ==========================
// SCROLL PARA CATEGORIAS
// ==========================
function iniciarScrollCategorias() {
  const cards = document.querySelectorAll(".category-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const titulo = card.querySelector(".category-title").innerText;
      const secoes = document.querySelectorAll(".vitrine-title, #recommendations-header h2");

      secoes.forEach((secao) => {
        if (secao.innerText.includes(titulo)) {
          secao.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  });
}

// ==========================
// CARROSSEL BANNER
// ==========================
let bannerInterval = null;
function iniciarCarouselBanner() {
  const wrapper = document.getElementById("carousel-wrapper");
  const dots = Array.from(document.querySelectorAll(".dot"));

  if (!wrapper || !dots.length) return;

  const slides = Array.from(wrapper.children);
  const total = slides.length;

  let index = 0;

  // evita múltiplas inicializações
  if (wrapper.dataset.init === "true") return;
  wrapper.dataset.init = "true";

  // garante estado inicial
  wrapper.style.transform = "translateX(0)";

  function render(animate = true) {
    wrapper.style.transition = animate ? "transform .6s ease" : "none";
    wrapper.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d) => d.classList.remove("active"));
    dots[index % total].classList.add("active");
  }

  function next() {
    index++;

    // quando chega no final, volta instantaneamente pro início
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

  // clique nos dots
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      render();
      startAuto();
    });
  });

  // clique nas setas
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

  // pausa ao interagir (melhor UX)
  wrapper.addEventListener("mouseenter", stopAuto);
  wrapper.addEventListener("mouseleave", startAuto);

  // inicia
  render();
  startAuto();
}

function iniciarTabsRecomendacoes() {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
}
