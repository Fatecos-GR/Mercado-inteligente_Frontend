import { possuiPerfil } from "../utils/authGuard.js";

function configurarPermissoesSidebar() {
  if (possuiPerfil(["ADMIN"])) {
    return;
  }

  document.getElementById("menu-funcionarios")?.remove();
  document.getElementById("menu-clientes")?.remove();
  document.getElementById("menu-marcas")?.remove();
  document.getElementById("menu-categorias")?.remove();
  document.getElementById("menu-fornecedores")?.remove();
}

export function iniciarSidebarAdmin() {
  configurarPermissoesSidebar();
}
