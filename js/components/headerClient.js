import { obterToken, logout } from "../utils/localStorageUtils.js";

import { buscarProdutosPorNome } from "../services/api.js";
import { renderClienteProdutoCard } from "../render.js";

export function iniciarHeaderCliente() {
  iniciarMenuDepartamentos();
  iniciarCategoriasNav();
  atualizarCarrinhoHeader();
  iniciarAuthHeader();

  iniciarBuscaHeader();
}

export function iniciarAuthHeader() {
  const container = document.getElementById("auth-header-btn");

  if (!container) return;

  const token = obterToken();

  if (token) {
    // USUÁRIO LOGADO → MOSTRA LOGOUT
    container.innerHTML = `
      <a href="login.html?tipo=cliente" class="action-btn-vertical" id="btn-logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Sair</span>
      </a>
    `;

    document.getElementById("btn-logout").addEventListener("click", () => {
      logout(); // já limpa storage e redireciona
    });
  } else {
    // DESLOGADO → MOSTRA LOGIN
    container.innerHTML = `
      <a href="login.html?tipo=cliente" class="action-btn-vertical">
        <i class="fa-solid fa-sign-in"></i>
        <span>Cliente</span>
      </a>
    `;
  }
}

// =========================
// ATUALIZAR CARRINHO NO HEADER
// =========================

export function atualizarCarrinhoHeader() {
  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];
  let valorTotal = 0;

  carrinho.forEach((item) => {
    valorTotal += item.preco * item.quantidade;
  });

  const valueElement = document.querySelector(".cart-pill-btn .value");
  if (valueElement) {
    valueElement.textContent = valorTotal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

// =========================
// MENU DE DEPARTAMENTOS
// =========================

function iniciarMenuDepartamentos() {
  const btnDep = document.querySelector(".btn-departamentos");
  const dropdownDep = document.getElementById("dropdown-departamentos");

  if (!btnDep || !dropdownDep) return;

  btnDep.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownDep.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdownDep.contains(e.target) && e.target !== btnDep) {
      dropdownDep.classList.remove("show");
    }
  });
}

// =========================
// NAVEGAÇÃO DAS CATEGORIAS
// =========================

function iniciarCategoriasNav() {
  const linksHeader = document.querySelectorAll(
    ".nav-categorias a, .lista-departamentos a",
  );

  linksHeader.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Se for um link de âncora interno (mesma página ou apontando explicitamente para index.html)
      if (href && (href.startsWith("#") || href.includes("index.html#"))) {
        const targetId = href.split("#")[1];
        const element = document.getElementById(targetId);

        // Se o elemento existe na página atual, faz o scroll suave
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Fecha o dropdown se estiver aberto
          const dropdownDep = document.getElementById("dropdown-departamentos");
          if (dropdownDep) dropdownDep.classList.remove("show");
        }
        // Se não existir (estamos em outra página), deixa o navegador seguir o link normalmente para index.html#id
      }
    });
  });
}

// =========================
// TOAST NOTIFICATION
// =========================

export function mostrarToastProduto(nomeProduto) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toastMsg = document.createElement("div");
  toastMsg.className = "toast-msg";
  toastMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${nomeProduto} adicionado ao carrinho!`;

  toastContainer.appendChild(toastMsg);

  setTimeout(() => {
    toastMsg.classList.add("esconder");
    toastMsg.addEventListener("animationend", () => {
      toastMsg.remove();
    });
  }, 3000);
}

function iniciarBuscaHeader() {
  const input = document.getElementById("search-input");
  const form = document.getElementById("header-search-form");
  const suggestionsBox = document.getElementById("search-suggestions");

  if (!input || !form || !suggestionsBox) return;

  let timeout;

  input.addEventListener("input", () => {
    const value = input.value.trim();

    clearTimeout(timeout);

    if (value.length < 1) {
      esconderSugestoes(suggestionsBox);
      return;
    }

    timeout = setTimeout(async () => {
      try {
        const produtos = await buscarProdutosPorNome(value);

        const lista = Array.isArray(produtos) ? produtos : [];

        renderSugestoes(lista, suggestionsBox);
      } catch (err) {
        console.error("Erro autocomplete:", err);
      }
    }, 250);
  });

  // clique nas sugestões
  suggestionsBox.addEventListener("click", (e) => {
    const item = e.target.closest(".search-suggestion-item");
    if (!item) return;

    const id = item.dataset.id;
    if (!id) return;

    window.location.href = `detalhes_prod.html?id=${id}`;
  });

  // fechar ao clicar fora
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== input) {
      esconderSugestoes(suggestionsBox);
    }
  });

  // submit busca
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = input.value.trim();
    if (!value) return;

    window.location.href = `index.html?q=${encodeURIComponent(value)}`;
  });
}

function iniciarCliqueSugestao() {
  const suggestionsBox = document.getElementById("search-suggestions");

  suggestionsBox.onclick = (e) => {
    const item = e.target.closest(".search-suggestion-item");
    if (!item) return;

    const id = item.dataset.id;
    window.location.href = `detalhes_prod.html?id=${id}`;
  };
}

function renderSugestoes(produtos, suggestionsBox) {
  if (!produtos.length) {
    suggestionsBox.innerHTML = `
      <div class="search-suggestion-item">
        Nenhum produto encontrado
      </div>
    `;
    suggestionsBox.classList.add("show");
    return;
  }

  suggestionsBox.innerHTML = produtos
    .slice(0, 6)
    .map((produto) => {
      const img = produto.imagem?.trim() || "/img/placeholder.png";

      return `
        <div class="search-suggestion-item" data-id="${produto.id}">
          <img src="${img}" />
          <div>
            <strong>${produto.nome}</strong><br/>
            <small>R$ ${Number(produto.preco).toFixed(2)}</small>
          </div>
        </div>
      `;
    })
    .join("");

  suggestionsBox.classList.add("show");
}

function esconderSugestoes(suggestionsBox) {
  suggestionsBox.classList.remove("show");
  suggestionsBox.innerHTML = "";
}
