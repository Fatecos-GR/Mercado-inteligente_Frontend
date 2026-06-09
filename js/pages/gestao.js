// ======================================
// IMPORTS
// ======================================

import { entidades } from "../config/entidades_admin.js";

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

// ======================================
// MOCK TEMPORÁRIO
// ======================================

function renderMockCards(entidade) {
  const grid = document.getElementById("gestao-grid");

  // MOCKS TEMPORÁRIOS
  const mocks = {
    produtos: `
      <article class="product-card">
        <h3>Arroz Integral</h3>
        <span>Categoria: Alimentos</span>
      </article>
    `,

    marcas: `
      <article class="product-card">
        <h3>Nestlé</h3>
      </article>
    `,

    categorias: `
      <article class="product-card">
        <h3>Bebidas</h3>
      </article>
    `,

    fornecedores: `
      <article class="product-card">
        <h3>Fornecedor XPTO</h3>
        <span>(11) 99999-9999</span>
      </article>
    `,
  };

  grid.innerHTML = mocks[entidade.tipo];
}

// ======================================
// START
// ======================================

export function iniciarGestao() {
  const entidade = getEntidadeAtual();

  if (!entidade) return;

  configurarPagina(entidade);

  // TEMPORÁRIO
  renderMockCards(entidade);
}
