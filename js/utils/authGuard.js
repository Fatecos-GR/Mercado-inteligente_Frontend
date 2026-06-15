// ======================================
// IMPORTS
// ======================================
import { obterToken, obterPerfil } from "./localStorageUtils.js";

// ======================================
// PROTEÇÃO CONTRA ACESSO SEM TOKEN
// ======================================
export function protegerRotaPerfil(perfisPermitidos) {
  const token = obterToken();

  const perfil = obterPerfil();

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
