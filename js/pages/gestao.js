// ======================================
// IMPORTS
// ======================================

import {
  buscarProdutos,
  buscarMarcas,
  buscarCategorias,
} from "../services/api.js";

import { entidades } from "../config/entidades_admin.js";

import {
  renderAdminProdutoCard,
  renderAdminMarcaCard,
  renderAdminCategoriaCard,
} from "../render.js";

// ======================================
// PEGAR PARÂMETRO DA URL
// ======================================

function getTipoEntidade() {
  const params = new URLSearchParams(window.location.search);

  return params.get("tipo");
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

async function renderCards(entidade) {
  const grid = document.getElementById("gestao-grid");

  // DADOS
  const produtos = await buscarProdutos();

  const marcas = await buscarMarcas();

  const categorias = await buscarCategorias();

  // ======================================
  // PRODUTOS
  // ======================================

  if (entidade.tipo === "produtos") {
    grid.innerHTML = produtos.map(renderAdminProdutoCard).join("");

    return;
  }

  // ======================================
  // MARCAS
  // ======================================

  if (entidade.tipo === "marcas") {
    grid.innerHTML = marcas.map(renderAdminMarcaCard).join("");

    return;
  }

  if (entidade.tipo === "categorias") {
    grid.innerHTML = categorias.map(renderAdminCategoriaCard).join("");

    return;
  }

  // ======================================
  // PADRÃO TEMPORÁRIO
  // ======================================

  grid.innerHTML = `
    <p>
      Renderização ainda não criada.
    </p>
  `;
}

// ======================================
// START
// ======================================

export async function iniciarGestao() {
  const entidade = getEntidadeAtual();

  if (!entidade) return;

  configurarPagina(entidade);

  // TEMPORÁRIO
  renderCards(entidade);
}
