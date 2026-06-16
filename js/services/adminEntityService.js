// ======================================
// IMPORTS
// ======================================

import {
  // ESTOQUE
  buscarEstoques,
  buscarEstoquePorIdProduto,
  ajustarEstoque,

  // PRODUTOS
  buscarProdutos,
  buscarProdutosPorNome,
  buscarProdutoPorId,
  salvarProduto,
  atualizarProduto,
  excluirProduto,

  // MARCAS
  buscarMarcas,
  buscarMarcasPorNome,
  buscarMarcaPorId,
  salvarMarca,
  atualizarMarca,
  excluirMarca,

  // CATEGORIAS
  buscarCategorias,
  buscarCategoriasPorNome,
  buscarCategoriaPorId,
  salvarCategoria,
  atualizarCategoria,
  excluirCategoria,

  // FORNECEDORES
  buscarFornecedores,
  buscarFornecedoresPorNome,
  buscarFornecedorPorId,
  salvarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,

  // FUNCIONÁRIOS
  buscarFuncionarios,
  buscarFuncionariosPorNome,
  buscarFuncionarioPorId,
  salvarFuncionario,
  atualizarFuncionario,
  excluirFuncionario,
} from "./api.js";

import {
  renderAdminProdutoCard,
  renderAdminMarcaCard,
  renderAdminCategoriaCard,
  renderAdminFornecedorCard,
  renderAdminFuncionarioCard,
} from "../render.js";

// ======================================
// CONFIGURAÇÃO DAS ENTIDADES
// ======================================

const entityServices = {
  estoque: {
    buscarTodos: buscarEstoques,

    buscar: buscarEstoquePorIdProduto,

    salvar: ajustarEstoque,

    atualizar: ajustarEstoque,
  },

  produtos: {
    buscarTodos: buscarProdutos,

    buscarPorNome: buscarProdutosPorNome,

    buscar: buscarProdutoPorId,

    salvar: salvarProduto,

    atualizar: atualizarProduto,

    excluir: excluirProduto,

    renderCard: renderAdminProdutoCard,
  },

  marcas: {
    buscarTodos: buscarMarcas,

    buscarPorNome: buscarMarcasPorNome,

    buscar: buscarMarcaPorId,

    salvar: salvarMarca,

    atualizar: atualizarMarca,

    excluir: excluirMarca,

    renderCard: renderAdminMarcaCard,
  },

  categorias: {
    buscarTodos: buscarCategorias,

    buscarPorNome: buscarCategoriasPorNome,

    buscar: buscarCategoriaPorId,

    salvar: salvarCategoria,

    atualizar: atualizarCategoria,

    excluir: excluirCategoria,

    renderCard: renderAdminCategoriaCard,
  },

  fornecedores: {
    buscarTodos: buscarFornecedores,

    buscarPorNome: buscarFornecedoresPorNome,

    buscar: buscarFornecedorPorId,

    salvar: salvarFornecedor,

    atualizar: atualizarFornecedor,

    excluir: excluirFornecedor,

    renderCard: renderAdminFornecedorCard,
  },

  funcionarios: {
    buscarTodos: buscarFuncionarios,

    buscarPorNome: buscarFuncionariosPorNome,

    buscar: buscarFuncionarioPorId,

    salvar: salvarFuncionario,

    atualizar: atualizarFuncionario,

    excluir: excluirFuncionario,

    renderCard: renderAdminFuncionarioCard,
  },
};

// ======================================
// EXPORT
// ======================================

export function getEntityService(tipo) {
  return entityServices[tipo];
}
