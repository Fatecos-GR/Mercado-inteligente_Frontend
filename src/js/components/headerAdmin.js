import { logout, obterNome, obterPerfil } from "../utils/localStorageUtils.js";

export function iniciarHeaderAdmin() {
  preencherUsuario();
  iniciarLogout();
}

function preencherUsuario() {
  const info = document.getElementById("admin-user-info");

  if (!info) return;

  const nome = obterNome();
  const perfil = obterPerfil();

  const perfilFormatado = perfil === "ADMIN" ? "Administrador" : "Estoquista";

  info.textContent = `${perfilFormatado}: ${nome}`;
}

function iniciarLogout() {
  const btnLogout = document.getElementById("btn-logout");

  if (!btnLogout) return;

  btnLogout.addEventListener("click", (e) => {
    e.preventDefault();

    logout();
  });
}
