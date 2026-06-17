// ======================================
// IMPORTS
// ======================================

import { protegerRotaPerfil } from "../utils/authGuard.js";

import { entidades } from "../config/entidades_admin.js";

import { renderSkeletonGestao } from "../render.js";

import { getEntityService } from "../services/adminEntityService.js";

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

  grid.innerHTML = renderSkeletonGestao(8);

  const termoBusca = getSearchTerm();

  const service = getEntityService(entidade.tipo);

  let dados = [];

  if (termoBusca && service.buscarPorNome) {
    dados = await service.buscarPorNome(termoBusca);
  } else {
    dados = await service.buscarTodos();
  }

  grid.innerHTML = dados.map(service.renderCard).join("");
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

  if (!protegerRotaPerfil(entidade.perfisPermitidos)) {
    return;
  }

  configurarPagina(entidade);

  configurarBusca(entidade);

  await renderCards(entidade);
}
