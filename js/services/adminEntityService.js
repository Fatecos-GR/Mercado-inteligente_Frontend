// ======================================
// IMPORTS
// ======================================

import {
  buscarMarcaPorId,
  salvarMarca,
  atualizarMarca,
  excluirMarca,
  buscarCategoriaPorId,
  salvarCategoria,
  atualizarCategoria,
  excluirCategoria,
  buscarFornecedorPorId,
  salvarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,
} from "./api.js";

// ======================================
// CONFIGURAÇÃO DAS ENTIDADES
// ======================================

const entityServices = {
  marcas: {
    buscar: buscarMarcaPorId,
    salvar: salvarMarca,
    atualizar: atualizarMarca,
    excluir: excluirMarca,
  },

  categorias: {
    buscar: buscarCategoriaPorId,
    salvar: salvarCategoria,
    atualizar: atualizarCategoria,
    excluir: excluirCategoria,
  },

  fornecedores: {
    buscar: buscarFornecedorPorId,
    salvar: salvarFornecedor,
    atualizar: atualizarFornecedor,
    excluir: excluirFornecedor,
  },
};

// ======================================
// EXPORT
// ======================================

export function getEntityService(tipo) {
  return entityServices[tipo];
}
