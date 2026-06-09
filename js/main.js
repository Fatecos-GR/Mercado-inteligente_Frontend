// ===============================
// IMPORTS
// ===============================
import { iniciarHome } from "./pages/home.js";

import { iniciarPerfil } from "./pages/perfil.js";

import { iniciarGestao } from "./pages/gestao.js";

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

  // Configura o menu de departamentos
  const btnDep = document.querySelector(".btn-departamentos");
  const dropdownDep = document.getElementById("dropdown-departamentos");

  if (btnDep && dropdownDep) {
    btnDep.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownDep.classList.toggle("show");
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", (e) => {
      if (!dropdownDep.contains(e.target) && e.target !== btnDep) {
        dropdownDep.classList.remove("show");
      }
    });
  }

  // Configura os links de categorias do sub-header
  const linksCat = document.querySelectorAll(".nav-categorias a");
  linksCat.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Se for um link interno (ID), faz scroll suave
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Se o link aponta para uma página real (.html), deixa seguir
      if (href && href.endsWith(".html")) return;

      e.preventDefault();
      const titulo = link.innerText;
      const secoes = document.querySelectorAll(
        ".vitrine-title, #recommendations-header h2",
      );

      let encontrou = false;
      secoes.forEach((secao) => {
        if (!encontrou && secao.innerText.includes(titulo)) {
          secao.scrollIntoView({ behavior: "smooth", block: "center" });
          encontrou = true;
        }
      });

      if (!encontrou) {
        window.location.href = "index.html";
      }
    });
  });

  // Garante que o header seja atualizado após o carregamento do layout
  window.atualizarHeaderCarrinho();
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
}

// Inicialização
start();
