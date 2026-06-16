import { possuiPerfil } from "../utils/authGuard.js";

function configurarPermissoesSidebar() {
  //   if (possuiPerfil(["ADMIN"])) {
  //     return;
  //   }
  //   document.getElementById("menu-funcionarios")?.remove();
  //   document.getElementById("menu-usuarios")?.remove();
  //   document.getElementById("menu-configuracoes")?.remove();
}

export function iniciarSidebarAdmin() {
  configurarPermissoesSidebar();
}
