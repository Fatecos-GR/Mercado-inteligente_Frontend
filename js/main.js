// ===============================
// IMPORTS
// ===============================
import { iniciarHome } from "./pages/home.js";

import { iniciarPerfil } from "./pages/perfil.js";

import { iniciarGestao } from "./pages/gestao.js";

import { iniciarHeaderCliente } from "./components/header_client.js";

import { iniciarFormularioAdmin } from "./pages/form_admin.js";

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
  async function carregarSeExistir(id, arquivo, callback) {
    const elemento = document.getElementById(id);

    elemento ? await loadComponent(id, arquivo) : null;

    // CallBack opcional
    if (elemento && callback) {
      callback();
    }
  }

  await carregarSeExistir(
    "main-header",
    "components/header.html",
    iniciarHeaderCliente,
  );
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

  const isGestaoPage = window.location.pathname.includes("gestao.html");

  if (isGestaoPage) {
    iniciarGestao();
  }

  const isFormAdminPage = window.location.pathname.includes("form_admin.html");

  if (isFormAdminPage) {
    iniciarFormularioAdmin();
  }
}

// Inicialização
start();
