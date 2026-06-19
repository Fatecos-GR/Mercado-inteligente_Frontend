import { obterToken, logoutCliente } from "../utils/localStorageUtils.js";

import {
  buscarProdutosPorNome,
  buscarCategorias,
  obterCarrinhoAtivo,
} from "../services/api.js";
import { renderClienteProdutoCard } from "../render.js";

export async function iniciarHeaderCliente() {
  iniciarMenuDepartamentos();
  await iniciarCategoriasNav();
  atualizarCarrinhoHeader();
  renderizarEstadoAuthHeader();
  iniciarBuscaHeader();
}

function renderizarEstadoAuthHeader() {
  const token = obterToken();

  const containerAuth = document.getElementById("auth-header-btn");
  const perfilBtn = document.getElementById("perfil-header-btn");
  const carrinhoBtn = document.getElementById("carrinho-btn");

  if (!containerAuth) return;

  if (token) {
    // LOGADO
    containerAuth.innerHTML = `
      <a href="#" class="action-btn-vertical" id="btn-logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Sair</span>
      </a>
    `;

    perfilBtn.style.display = "flex";
    carrinhoBtn.style.display = "flex";

    document.getElementById("btn-logout").addEventListener("click", (e) => {
      e.preventDefault();
      logoutCliente();
      renderizarEstadoAuthHeader(); // atualiza UI
    });
  } else {
    // DESLOGADO
    containerAuth.innerHTML = `
      <a href="login.html?tipo=cliente" class="action-btn-vertical">
        <i class="fa-solid fa-sign-in"></i>
        <span>Entrar</span>
      </a>
    `;

    // some com perfil e carrinho
    if (perfilBtn) perfilBtn.style.display = "none";
    if (carrinhoBtn) carrinhoBtn.style.display = "none";
  }
}

// =========================
// ATUALIZAR CARRINHO NO HEADER
// =========================

export async function atualizarCarrinhoHeader() {
  const valueElement = document.querySelector(".cart-pill-btn .value");

  if (!valueElement) return;

  try {
    const carrinho = await obterCarrinhoAtivo();

    const valorTotal = carrinho?.valorTotal || 0;

    valueElement.textContent = valorTotal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (erro) {
    valueElement.textContent = "0,00";
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

async function iniciarCategoriasNav() {
  const lista = document.querySelector(".lista-departamentos");

  if (!lista) return;

  try {
    const categorias = await buscarCategorias();

    if (!Array.isArray(categorias)) return;

    lista.innerHTML = categorias
      .map((cat) => {
        return `
          <li>
           <a href="index.html?categoria=${slugify(cat.nome)}">
              <i class="${cat.icone || "fa-solid fa-box"}"></i>
              ${cat.nome}
            </a>
          </li>
        `;
      })
      .join("");

    ativarScrollCategorias();
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
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

function ativarScrollCategorias() {
  const links = document.querySelectorAll(".lista-departamentos a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.includes("#")) {
        const id = href.split("#")[1];
        const el = document.getElementById(id);

        if (el) {
          e.preventDefault();

          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          const dropdown = document.getElementById("dropdown-departamentos");
          dropdown?.classList.remove("show");
        }
      }
    });
  });
}
