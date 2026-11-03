import { entidades } from "../config/entidades_admin.js";

// ======================================
// PEGAR TIPO
// ======================================

export function getTipoEntidade() {
  return new URLSearchParams(window.location.search).get("tipo");
}

// ======================================
// PEGAR ID E VER SE ESTÁ EM EDIÇÃO
// ======================================

export function getIdRegistro() {
  return new URLSearchParams(window.location.search).get("id");
}

export function estaEditando() {
  return !!getIdRegistro();
}

// ======================================
// ENTIDADE ATUAL
// ======================================
export function getEntidadeAtual() {
  return entidades[getTipoEntidade()];
}
