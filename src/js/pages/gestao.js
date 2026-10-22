// ======================================
// IMPORTS
// ======================================

import { protegerRotaPerfil } from "../utils/authGuard.js";

import { entidades } from "../config/entidades_admin.js";

import { renderSkeletonGestao, renderFiltrosGestao } from "../render.js";

import { getEntityService } from "../services/adminEntityService.js";

import { obterPerfil } from "../utils/localStorageUtils.js";

import {
  atualizarFiltro,
  getFiltro,
  obterFiltros,
} from "../utils/filterUtils.js";

import { popularSelectGenerico } from "../utils/selectUtils.js";

import { getStatusValidade } from "../utils/validadeUtils.js";

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
  const filtrosContainer = document.getElementById("gestao-filtros");

  if (entidade.filtros?.length) {
    filtrosContainer.innerHTML = renderFiltrosGestao(entidade);
    filtrosContainer.style.display = "block";
  } else {
    filtrosContainer.style.display = "none";
  }

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

  console.log("obterPerfil()", obterPerfil());

  const perfilUsuario = obterPerfil();

  const podeCadastrar =
    entidade.permiteCadastro !== false &&
    (!entidade.permiteCadastroPerfis ||
      entidade.permiteCadastroPerfis.includes(perfilUsuario));

  if (!podeCadastrar) {
    botaoAdicionar.style.display = "none";
    return;
  }

  botaoTexto.textContent = entidade.textoBotaoAdicionar;
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

  const filtros = obterFiltros();

  console.log("Filtros:", filtros);

  dados = await service.buscarTodos();

  if (filtros.search) {
    dados = dados.filter((item) =>
      item.nome.toLowerCase().includes(filtros.search.toLowerCase()),
    );
  }

  if (filtros.marcaId) {
    dados = dados.filter((item) => String(item.marcaId) === filtros.marcaId);
  }

  if (filtros.categoriaId) {
    dados = dados.filter(
      (item) => String(item.categoriaId) === filtros.categoriaId,
    );
  }

  if (filtros.fornecedorId) {
    dados = dados.filter(
      (item) => String(item.fornecedorId) === filtros.fornecedorId,
    );
  }

  if (filtros.baixoEstoque) {
    dados = dados.filter((item) => {
      const quantidade = item.estoqueDisponivel ?? 0;

      return filtros.baixoEstoque === "true"
        ? quantidade <= 10
        : quantidade > 10;
    });
  }

  if (filtros.validadeStatus) {
    dados = dados.filter((item) => {
      const status = getStatusValidade(item.validade);

      if (filtros.validadeStatus === "TODOS") {
        return true;
      }

      return status === filtros.validadeStatus;
    });
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

async function configurarFiltros(entidade) {
  if (!entidade.filtros?.length) {
    return;
  }

  for (const filtro of entidade.filtros) {
    const select = document.getElementById(
      filtro.opcoes
        ? `filtro-${filtro.parametro}`
        : `filtro-${filtro.parametro.replace("Id", "")}`,
    );

    if (!select) continue;

    if (filtro.entidadeRelacionada) {
      await popularSelectGenerico(
        select,
        filtro.entidadeRelacionada,
        filtro.placeholder,
      );
    }

    select.value = getFiltro(filtro.parametro);

    select.addEventListener("change", async () => {
      console.log("Filtro alterado:", filtro.parametro, select.value);
      atualizarFiltro(filtro.parametro, select.value);

      await renderCards(entidade);
    });
  }
}

function limparFiltros(entidade) {
  atualizarFiltro("search", "");

  atualizarFiltro("marcaId", "");
  atualizarFiltro("categoriaId", "");
  atualizarFiltro("fornecedorId", "");
  atualizarFiltro("baixoEstoque", "");
  atualizarFiltro("validadeStatus", "");

  document.getElementById("search-input").value = "";

  document
    .querySelectorAll(".gestao-filtro")
    .forEach((select) => (select.value = ""));

  renderCards(entidade);
}

function configurarBotaoLimparFiltros(entidade) {
  const btn = document.getElementById("btn-limpar-filtros");

  if (!btn) return;

  btn.addEventListener("click", () => limparFiltros(entidade));
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

  await configurarFiltros(entidade);

  configurarBusca(entidade);

  configurarBotaoLimparFiltros(entidade);

  await renderCards(entidade);
}
