// ======================================
// IMPORTS
// ======================================

import { protegerRotaAdmin } from "../utils/authGuard.js";

import {
  buscarProdutos,
  buscarProdutosPorNome,
  buscarMarcas,
  buscarMarcasPorNome,
  buscarCategorias,
  buscarCategoriasPorNome,
} from "../services/api.js";

import { entidades } from "../config/entidades_admin.js";

import {
  renderAdminProdutoCard,
  renderAdminMarcaCard,
  renderAdminCategoriaCard,
  renderResultadoBuscaGestao,
} from "../render.js";

// ======================================
// PEGAR PARÂMETRO DA URL E FUNCIONALIDADES DE URL
// ======================================

function getTipoEntidade() {
  const params = new URLSearchParams(window.location.search);

  return params.get("tipo");
}

function getSearchTerm() {
  const params = new URLSearchParams(window.location.search);

  return params.get("search") || "";
}

function atualizarURLBusca(valor) {
  const url = new URL(window.location);

  if (valor) {
    url.searchParams.set("search", valor);
  } else {
    url.searchParams.delete("search");
  }

  history.replaceState({}, "", url);
}

// ======================================
// VALIDAR ENTIDADE
// ======================================

function getEntidadeAtual() {
  const tipo = getTipoEntidade();

  const entidade = entidades[tipo];

  // Se entidade não existir
  if (!entidade) {
    return null;
  }

  return entidade;
}

// ======================================
// ALTERAR INFORMAÇÕES DA TELA
// ======================================

function configurarPagina(entidade) {
  // TÍTULO DA ABA
  document.title = `${entidade.titulo} | Admin Melior`;

  // TÍTULO PRINCIPAL
  const titulo = document.getElementById("gestao-titulo");

  titulo.textContent = entidade.titulo;

  // SUBTÍTULO
  const subtitulo = document.getElementById("gestao-subtitulo");

  subtitulo.textContent = entidade.subtitulo;

  // PLACEHOLDER BUSCA
  const busca = document.getElementById("search-input");

  busca.placeholder = entidade.placeholderBusca;

  // BOTÃO
  const botaoTexto = document.getElementById("btn-adicionar-texto");

  botaoTexto.textContent = entidade.textoBotaoAdicionar;

  // LINK BOTÃO
  const botaoAdicionar = document.getElementById("btn-adicionar-item");

  botaoAdicionar.href = entidade.rotaFormulario;
}

// ======================================
// RENDERIZAÇÃO DOS CARDS
// ======================================
async function renderCards(entidade) {
  const grid = document.getElementById("gestao-grid");

  const termoBusca = getSearchTerm();

  let dados = [];

  // PRODUTOS
  if (entidade.tipo === "produtos") {
    dados = termoBusca
      ? await buscarProdutosPorNome(termoBusca)
      : await buscarProdutos();

    grid.innerHTML = dados.map(renderAdminProdutoCard).join("");
    return;
  }

  // MARCAS
  if (entidade.tipo === "marcas") {
    dados = termoBusca
      ? await buscarMarcasPorNome(termoBusca)
      : await buscarMarcas();

    grid.innerHTML = dados.map(renderAdminMarcaCard).join("");
    return;
  }

  // CATEGORIAS
  if (entidade.tipo === "categorias") {
    dados = termoBusca
      ? await buscarCategoriasPorNome(termoBusca)
      : await buscarCategorias();

    grid.innerHTML = dados.map(renderAdminCategoriaCard).join("");
    return;
  }
}

// ======================================
// CONFIGURAÇÃO DA BUSCA
// ======================================
let timeoutBusca;
function configurarBusca(entidade) {
  const input = document.getElementById("search-input");

  input.value = getSearchTerm();

  input.addEventListener("input", async (e) => {
    const valor = e.target.value.trim();

    atualizarURLBusca(valor);

    clearTimeout(timeoutBusca);

    timeoutBusca = setTimeout(() => {
      renderCards(entidade);
    }, 100);
  });
}

// ======================================
// START
// ======================================

export async function iniciarGestao() {
  const entidade = getEntidadeAtual();

  if (!entidade) return;

  if (!protegerRotaAdmin()) return;

  configurarPagina(entidade);

  configurarBusca(entidade);

  await renderCards(entidade);
}
