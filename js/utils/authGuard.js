// ======================================
// IMPORTS
// ======================================
import { obterToken } from "./localStorageUtils.js";

// ======================================
// PROTEÇÃO CONTRA ACESSO SEM TOKEN
// ======================================
export function protegerRotaAdmin() {
  const token = obterToken();

  if (!token) {
    window.location.href = "/login.html?tipo=admin";
    return false;
  }

  return true;
}
