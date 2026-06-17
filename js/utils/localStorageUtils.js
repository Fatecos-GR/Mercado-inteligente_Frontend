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
  removerNome();
  removerId();

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

export function salvarNome(nome) {
  localStorage.setItem("nome", nome);
}

export function obterNome() {
  return localStorage.getItem("nome") || "";
}

export function removerNome() {
  localStorage.removeItem("nome");
}

export function salvarId(id) {
  localStorage.setItem("idUsuario", id);
}

export function obterId() {
  return Number(localStorage.getItem("idUsuario"));
}

export function removerId() {
  localStorage.removeItem("idUsuario");
}
