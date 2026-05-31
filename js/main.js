// ===============================
// IMPORTS
// ===============================
import { iniciarHome } from "./pages/home.js";

import { iniciarPerfil } from "./pages/perfil.js";

// ===============================
// FUNÇÃO AUXILIAR PARA CARREGAR OS COMPONENTES HTML
// ===============================

async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// ===============================
// CARREGAR FONT AWESOME
// ===============================
function carregarIcones() {
  if (document.querySelector("link[data-fontawesome]")) return;

  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";
  link.crossOrigin = "anonymous";
  link.referrerPolicy = "no-referrer";

  link.setAttribute("data-fontawesome", "true");

  document.head.appendChild(link);
}

// ===============================
// CARREGAR HEADER E FOOTER
// ===============================

async function carregarLayout() {
  // Função auxiliar
  async function carregarSeExistir(id, arquivo) {
    const elemento = document.getElementById(id);

    // Se existir, carrega
    if (elemento) {
      await loadComponent(id, arquivo);
    }
  }

  await carregarSeExistir("main-header", "components/header.html");
  await carregarSeExistir("main-footer", "components/footer.html");
  await carregarSeExistir("admin-header", "components/admin-header.html");
  await carregarSeExistir("admin-sidebar", "components/admin-sidebar.html");
}

// ===============================
// START PRINCIPAL
// ===============================

async function start() {
  //Componentes Modularizados
  await carregarLayout();
  await carregarIcones();

  // Se esta na home
  const isIndexPage = window.location.pathname.includes("index.html");

  if (isIndexPage) {
    iniciarHome();
  }

  // Se esta na tela de perfil
  const isPerfilPage = window.location.pathname.includes("perfil.html");

  if (isPerfilPage) {
    iniciarPerfil();
  }
}

// Inicialização
start();
