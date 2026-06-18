import { produtosMock } from "../data/produtosMock.js";
import {
  atualizarCarrinhoHeader,
  mostrarToastProduto,
} from "../components/headerClient.js";
import { renderProdutoCard } from "../render.js";

// ==========================
// INICIALIZAÇÃO DE PÁGINA
// ==========================

export function iniciarHome() {
  renderizarProdutos();
  iniciarCarouselBanner();
  iniciarTabsRecomendacoes();
  iniciarScrollCategorias();
  iniciarNavegacaoCategorias();
  iniciarNavegacaoVitrines();
  iniciarBotoesCarrinho();
  iniciarOrdenacao();
  iniciarControlesQuantidade();
}

function renderizarProdutos() {
  const grids = {
    "grid-hortifruti": "h",
    "grid-acougue": "a",
    "grid-padaria": "p",
    "grid-bebidas": "b",
    "grid-limpeza": "l",
    "grid-higiene": "i",
    "grid-petshop": "ps",
    "grid-congelados": "c",
    "grid-mercearia": "m",
  };

  Object.entries(grids).forEach(([gridId, prefix]) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    // Filtra pelo prefixo (agora sem limite para permitir o carrossel)
    const produtos = produtosMock.filter((p) => p.id.startsWith(prefix));

    grid.innerHTML = produtos.map(renderProdutoCard).join("");
  });
}

function iniciarNavegacaoVitrines() {
  const btns = document.querySelectorAll(".vitrine-nav-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const grid = document.getElementById(targetId);
      if (!grid) return;

      const wrapper = grid.parentElement;
      const scrollAmount = 300;

      if (btn.classList.contains("prev")) {
        wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });
  });
}

function iniciarControlesQuantidade() {
  const containers = document.querySelectorAll(".card-quantity-control");
  containers.forEach((container) => {
    const btnMinus = container.querySelector(".btn-qty-minus");
    const btnPlus = container.querySelector(".btn-qty-plus");
    const input = container.querySelector(".input-qty");

    if (!btnMinus || !btnPlus || !input) return;

    btnMinus.addEventListener("click", () => {
      let val = parseInt(input.value) || 1;
      if (val > 1) {
        input.value = val - 1;
      }
    });

    btnPlus.addEventListener("click", () => {
      let val = parseInt(input.value) || 1;
      input.value = val + 1;
    });

    input.addEventListener("change", () => {
      let val = parseInt(input.value);
      if (isNaN(val) || val < 1) {
        input.value = 1;
      }
    });
  });
}

// ==========================
// ORDENAÇÃO DE PRODUTOS
// ==========================
function iniciarOrdenacao() {
  const customSelect = document.getElementById("sort-select");
  if (!customSelect) return;

  const trigger = customSelect.querySelector(".select-trigger");
  const options = customSelect.querySelectorAll(".option");
  const triggerText = trigger.querySelector("span");

  // Toggle the dropdown
  trigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });

  // Handle option selection
  options.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      options.forEach((opt) => opt.classList.remove("active"));
      // Add active class to clicked option
      option.classList.add("active");

      const sortValue = option.getAttribute("data-value");
      triggerText.textContent = option.textContent;

      customSelect.classList.remove("open");

      ordenarProdutos(sortValue);
    });
  });

  // Store the initial order of all product cards in all grids
  const grids = document.querySelectorAll(".products-grid");
  grids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".product-card"));
    cards.forEach((card, index) => {
      card.setAttribute("data-original-index", index);
    });
  });
}

function parsePreco(text) {
  return parseFloat(
    text.replace("R$", "").replace(/\./g, "").replace(",", ".").trim(),
  );
}

function ordenarProdutos(sortValue) {
  const grids = document.querySelectorAll(".products-grid");

  grids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".product-card"));

    cards.sort((a, b) => {
      if (sortValue === "menor-preco") {
        const precoA = parsePreco(
          a.querySelector(".price-current").textContent,
        );
        const precoB = parsePreco(
          b.querySelector(".price-current").textContent,
        );
        return precoA - precoB;
      } else if (sortValue === "maior-preco") {
        const precoA = parsePreco(
          a.querySelector(".price-current").textContent,
        );
        const precoB = parsePreco(
          b.querySelector(".price-current").textContent,
        );
        return precoB - precoA;
      } else if (sortValue === "a-z") {
        const tituloA = a.querySelector(".product-title").textContent.trim();
        const tituloB = b.querySelector(".product-title").textContent.trim();
        return tituloA.localeCompare(tituloB);
      } else {
        // Padrão
        const indexA = parseInt(a.getAttribute("data-original-index"));
        const indexB = parseInt(b.getAttribute("data-original-index"));
        return indexA - indexB;
      }
    });

    // Re-append cards to grid in the new order
    cards.forEach((card) => grid.appendChild(card));
  });
}

// ==========================
// ADICIONAR AO CARRINHO
// ==========================
function iniciarBotoesCarrinho() {
  const botoesAdd = document.querySelectorAll(".btn-add-cart");

  botoesAdd.forEach((botao) => {
    botao.addEventListener("click", (e) => {
      e.preventDefault();
      const produtoId = botao.getAttribute("data-id");
      if (!produtoId) return;

      const produtoEncontrado = produtosMock.find((p) => p.id === produtoId);
      if (!produtoEncontrado) return;

      const qtyInput = document.getElementById(`qty-${produtoId}`);
      const quantidadeAdicionar = qtyInput ? parseInt(qtyInput.value) : 1;

      let carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];
      const indexExistente = carrinho.findIndex(
        (item) => item.id === produtoId,
      );

      if (indexExistente >= 0) {
        carrinho[indexExistente].quantidade += quantidadeAdicionar;
      } else {
        carrinho.push({
          id: produtoEncontrado.id,
          nome: produtoEncontrado.nome,
          preco: produtoEncontrado.preco,
          imagem: produtoEncontrado.imagem,
          quantidade: quantidadeAdicionar,
        });
      }

      if (qtyInput) {
        qtyInput.value = 1;
      }

      localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));

      // Feedback visual simples
      const icon = botao.querySelector("i");
      if (icon) {
        botao.innerHTML = 'Adicionado <i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          botao.innerHTML =
            'Adicionar <i class="fa-solid fa-cart-shopping"></i>';
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
      const secoes = document.querySelectorAll(
        ".vitrine-title, #recommendations-header h2",
      );

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
