// ======================================
// FUNCIONALIDADES DE LOCAL STORAGE
// ======================================

export function salvarToken(token) {
  localStorage.setItem("token", token);
}

export function obterToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");

  removerPerfil();

  window.location.href = "/login.html?tipo=admin";
}

export function salvarPerfil(perfil) {
  localStorage.setItem("perfil", perfil);
}

export function obterPerfil() {
  return localStorage.getItem("perfil");
}

export function removerPerfil() {
  localStorage.removeItem("perfil");
}
