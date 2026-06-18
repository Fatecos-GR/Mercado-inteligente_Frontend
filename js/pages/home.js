import {
  atualizarCarrinhoHeader,
  mostrarToastProduto,
} from "../components/headerClient.js";

import {
  renderClienteProdutoCard,
  renderClienteCategoriaCard,
  renderClienteCategoriaSection,
  renderClienteOfertaCard,
} from "../render.js";

import {
  buscarCategorias,
  buscarProdutos,
  buscarProdutoPorIdCategoria,
  buscarProdutosPorNome,
  buscarProdutosComDesconto,
} from "../services/api.js";

import { iniciarCarouselBanner } from "../utils/carrosellUtils.js";

import { adicionarItemCarrinho } from "../services/api.js";

let produtosCarregados = [];

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

          produtosCarregados.push(...produtos);
          return renderClienteCategoriaSection(categoria, produtos);
        }),
      );

      container.innerHTML = vitrinesHTML.join("");
    });

    await Promise.all(renders);

    // 3. Eventos globais (executa uma vez só depois de tudo renderizado)
    iniciarNavegacaoVitrines();
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
    const card = container.closest(".product-card");

    const estoque = Number(card.dataset.estoque || 0);

    const btnMinus = container.querySelector(".btn-qty-minus");
    const btnPlus = container.querySelector(".btn-qty-plus");
    const input = container.querySelector(".input-qty");

    if (!btnMinus || !btnPlus || !input) return;

    if (estoque <= 0) {
      input.value = 0;

      input.disabled = true;
      btnPlus.disabled = true;
      btnMinus.disabled = true;

      return;
    }

    btnMinus.addEventListener("click", () => {
      let val = parseInt(input.value) || 1;

      if (val > 1) {
        input.value = val - 1;
      }
    });

    btnPlus.addEventListener("click", () => {
      let val = parseInt(input.value) || 1;

      if (val < estoque) {
        input.value = val + 1;
      }
    });

    input.addEventListener("input", () => {
      let val = parseInt(input.value) || 1;

      if (val < 1) val = 1;
      if (val > estoque) val = estoque;

      input.value = val;
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
    botao.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const produtoId = botao.dataset.id;

        if (!produtoId) return;

        const qtyInput = document.getElementById(`qty-${produtoId}`);

        const quantidade = qtyInput ? Number(qtyInput.value) : 1;

        await adicionarItemCarrinho(Number(produtoId), quantidade);

        const produtoEncontrado = produtosCarregados.find(
          (p) => String(p.id) === String(produtoId),
        );

        if (qtyInput) {
          qtyInput.value = 1;
        }

        botao.innerHTML = 'Adicionado <i class="fa-solid fa-check"></i>';

        setTimeout(() => {
          botao.innerHTML =
            'Adicionar <i class="fa-solid fa-cart-shopping"></i>';
        }, 1500);

        atualizarCarrinhoHeader();

        if (produtoEncontrado) {
          mostrarToastProduto(produtoEncontrado.nome);
        }
      } catch (erro) {
        console.error("Erro ao adicionar item:", erro);

        window.location.href = "/login.html?tipo=cliente";
      }
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

async function renderizarOfertasMelior() {
  const secao = document.getElementById("ofertas-melior");

  if (!secao) return;

  try {
    const produtos = await buscarProdutosComDesconto();

    if (!produtos?.length) {
      return;
    }

    produtosCarregados.push(...produtos);

    secao.innerHTML = `
      <h2 class="vitrine-title">
        Ofertas Melior
      </h2>

      <div class="products-wrapper">
        <div class="products-grid">
          ${produtos.map(renderClienteOfertaCard).join("")}
        </div>
      </div>
    `;

    iniciarControlesQuantidade();
    iniciarBotoesCarrinho();
  } catch (erro) {
    console.error("Erro ao carregar ofertas:", erro);
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
  await renderizarOfertasMelior();

  iniciarCarouselBanner();
  iniciarTabsRecomendacoes();
  iniciarScrollCategorias();
  iniciarNavegacaoCategorias();
  iniciarOrdenacao();
}
