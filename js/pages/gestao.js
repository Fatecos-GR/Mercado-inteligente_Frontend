// ======================================
// IMPORTS
// ======================================

import { entidades } from "../config/entidades_admin.js";

import { renderProdutoCard } from "../components/produtoCardAdmin.js";

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

function renderCards(entidade) {
  const grid = document.getElementById("gestao-grid");

  // MOCK TEMPORÁRIO
  const produtos = [
    {
      nome: "Arroz Integral 5kg",
      categoriaNome: "Alimentos",
      marcaNome: "Camil",
      preco: "22,90",
      estoqueDisponivel: 50,
    },

    {
      nome: "Água Mineral 1L",
      categoriaNome: "Bebidas",
      marcaNome: "Crystal",
      preco: "4,50",
      estoqueDisponivel: 8,
    },
  ];

  // ======================================
  // PRODUTOS
  // ======================================

  if (entidade.tipo === "produtos") {
    grid.innerHTML = produtos.map(renderProdutoCard).join("");

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

export function iniciarGestao() {
  const entidade = getEntidadeAtual();

  if (!entidade) return;

  configurarPagina(entidade);

  // TEMPORÁRIO
  renderCards(entidade);
}
