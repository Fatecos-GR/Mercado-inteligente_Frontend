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

  window.location.href = "/login.html?tipo=admin";
}
