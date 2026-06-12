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
};

// ======================================
// EXPORT
// ======================================

export function getEntityService(tipo) {
  return entityServices[tipo];
}
