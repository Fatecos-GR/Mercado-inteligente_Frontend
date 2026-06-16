// ======================================
// IMPORTS
// ======================================

import { obterToken, obterPerfil } from "./localStorageUtils.js";

// ======================================
// PROTEÇÃO DE ROTAS
// ======================================

export function protegerRotaPerfil(perfisPermitidos) {
  const token = obterToken();

  const perfil = (obterPerfil() || "").trim().toUpperCase();

  if (!token) {
    window.location.href = "/login.html?tipo=admin";

    return false;
  }

  if (!perfisPermitidos.includes(perfil)) {
    window.location.href = "/login.html?tipo=admin";

    return false;
  }

  return true;
}

// ======================================
// PERFIL
// ======================================

export function obterPerfilAtual() {
  return obterPerfil();
}

export function possuiPerfil(perfisPermitidos) {
  return perfisPermitidos.includes(obterPerfil());
}
