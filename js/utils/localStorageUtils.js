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

export function logoutCliente() {
  localStorage.removeItem("token");

  removerPerfil();
  removerNome();
  removerSobrenome();
  removerEmail();
  removerTelefone();
  removerImagem();
  removerId();
  removerEndereco();

  window.location.href = "/login.html?tipo=cliente";
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

export function salvarSobrenome(sobrenome) {
  localStorage.setItem("sobrenome", sobrenome);
}

export function obterSobrenome() {
  return localStorage.getItem("sobrenome") || "";
}

export function removerSobrenome() {
  localStorage.removeItem("sobrenome");
}

export function salvarEmail(email) {
  localStorage.setItem("email", email);
}

export function obterEmail() {
  return localStorage.getItem("email") || "";
}

export function removerEmail() {
  localStorage.removeItem("email");
}

export function salvarTelefone(telefone) {
  localStorage.setItem("telefone", telefone);
}

export function obterTelefone() {
  return localStorage.getItem("telefone") || "";
}

export function removerTelefone() {
  localStorage.removeItem("telefone");
}

export function salvarImagem(imagem) {
  localStorage.setItem("imagem", imagem);
}

export function obterImagem() {
  return localStorage.getItem("imagem") || "";
}

export function removerImagem() {
  localStorage.removeItem("imagem");
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

export function salvarEndereco(endereco) {
  localStorage.setItem("endereco", JSON.stringify(endereco));
}

export function obterEndereco() {
  const endereco = localStorage.getItem("endereco");

  return endereco ? JSON.parse(endereco) : null;
}

export function removerEndereco() {
  localStorage.removeItem("endereco");
}
