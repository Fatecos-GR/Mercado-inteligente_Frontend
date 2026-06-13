import { logout } from "../utils/localStorageUtils.js";

export function iniciarHeaderAdmin() {
  iniciarLogout();
}

// =========================
// LOGOUT
// =========================

function iniciarLogout() {
  const btnLogout = document.getElementById("btn-logout");

  if (!btnLogout) return;

  btnLogout.addEventListener("click", (e) => {
    e.preventDefault();

    logout();
  });
}
