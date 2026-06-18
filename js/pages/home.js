import {
  atualizarCarrinhoHeader,
  mostrarToastProduto,
} from "../components/headerClient.js";

import {
  renderClienteProdutoCard,
  renderClienteCategoriaCard,
  renderClienteCategoriaSection,
} from "../render.js";

import {
  buscarCategorias,
  buscarProdutos,
  buscarProdutoPorIdCategoria,
  buscarProdutosPorNome,
} from "../services/api.js";

import { iniciarCarouselBanner } from "../utils/carrosellUtils.js";

function getCategoriaFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("categoria");
}

async function aplicarFiltroCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoriaSlug = params.get("categoria");

  if (!categoriaSlug) return false;

  document.body.classList.add("modo-busca");

  const container = document.querySelector(".vitrines-container");
  if (!container) return false;

  try {
    const categorias = await buscarCategorias();

    const categoria = categorias.find((c) => slugify(c.nome) === categoriaSlug);

    if (!categoria) {
      container.innerHTML = "<p>Categoria não encontrada</p>";
      return true;
    }

    const produtos = await buscarProdutoPorIdCategoria(categoria.id);

    const categoriaFake = {
      id: categoria.id,
      nome: categoria.nome,
    };

    container.innerHTML = renderClienteCategoriaSection(
      categoriaFake,
      produtos,
    );

    return true;
  } catch (err) {
    console.error("Erro filtro categoria:", err);
    return false;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// ==========================
// RENDERIZAÇÃO DAS CATEGORIAS
// ==========================
async function renderizarCategorias() {
  const container = document.getElementById("categories-carousel");
  if (!container) return;

  const categorias = await buscarCategorias();

  container.innerHTML = categorias.map(renderClienteCategoriaCard).join("");
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
// SCROLL PARA CATEGORIAS (QUANDO CLICAR LEVA PARA A SEÇÃO)
// ==========================
function iniciarScrollCategorias() {
  const cards = document.querySelectorAll(".category-card");

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      const target = card.getAttribute("href");
      if (!target) return;

      const section = document.querySelector(target);
      if (!section) return;

      section.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  });
}

// ==========================
// RENDERIZAR AS VITRINES DE PRODUTOS
// ==========================
async function renderizarVitrines() {
  const containers = document.querySelectorAll(".vitrines-container");

  if (!containers.length) return;

  try {
    // 1. Busca categorias uma vez só
    const categorias = await buscarCategorias();

    const tamanhoBloco = 3;

    // 2. Renderiza cada container baseado no data-bloco
    const renders = Array.from(containers).map(async (container) => {
      const bloco = Number(container.dataset.bloco);

      const start = (bloco - 1) * tamanhoBloco;
      const end = start + tamanhoBloco;

      const categoriasDoBloco = categorias.slice(start, end);

      const vitrinesHTML = await Promise.all(
        categoriasDoBloco.map(async (categoria) => {
          const produtos = await buscarProdutoPorIdCategoria(categoria.id);
          return renderClienteCategoriaSection(categoria, produtos);
        }),
      );

      container.innerHTML = vitrinesHTML.join("");
    });

    await Promise.all(renders);

    // 3. Eventos globais (executa uma vez só depois de tudo renderizado)
    iniciarNavegacaoVitrines();
    iniciarControlesQuantidade();
    iniciarBotoesCarrinho();
  } catch (err) {
    console.error("Erro ao renderizar vitrines:", err);
    containers.forEach((c) => {
      c.innerHTML = "<p>Erro ao carregar produtos</p>";
    });
  }
}

async function renderizarProdutos() {
  const container = document.getElementById("vitrines-container");
  if (!container) return;

  const categorias = await buscarCategorias();

  const produtosPorCategoria = await Promise.all(
    categorias.map(async (categoria) => {
      const produtos = await buscarProdutoPorIdCategoria(categoria.id);

      return {
        categoria,
        produtos,
      };
    }),
  );

  container.innerHTML = produtosPorCategoria
    .map(({ categoria, produtos }) =>
      renderClienteCategoriaSection(categoria, produtos),
    )
    .join("");
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

async function aplicarFiltroBusca() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  if (!query) return false;

  document.body.classList.add("modo-busca");

  const container = document.querySelector(".vitrines-container");
  if (!container) return false;

  try {
    const produtos = await buscarProdutosPorNome(query);

    const lista = Array.isArray(produtos) ? produtos : [];

    // transforma em "categoria fake" só para reutilizar render
    const categoriaFake = {
      id: "busca",
      nome: `Resultados para "${query}"`,
    };

    container.innerHTML = renderClienteCategoriaSection(categoriaFake, lista);

    return true;
  } catch (err) {
    console.error("Erro na busca:", err);
    return false;
  }
}

// ==========================
// INICIALIZAÇÃO DE PÁGINA
// ==========================

export async function iniciarHome() {
  const busca = await aplicarFiltroBusca();
  if (busca) return;

  const categoria = await aplicarFiltroCategoria();
  if (categoria) return;

  await renderizarVitrines();
  await renderizarCategorias();

  iniciarCarouselBanner();
  iniciarTabsRecomendacoes();
  iniciarScrollCategorias();
  iniciarNavegacaoCategorias();
  iniciarNavegacaoVitrines();
  iniciarBotoesCarrinho();
  iniciarOrdenacao();
  iniciarControlesQuantidade();
}
