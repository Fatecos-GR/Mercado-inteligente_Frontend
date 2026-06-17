// ===============================
// IMPORTS
// ===============================
import { iniciarHome } from "./pages/home.js";
import { iniciarPerfil } from "./pages/perfil.js";
import { iniciarGestao } from "./pages/gestao.js";
import { iniciarHeaderCliente } from "./components/headerClient.js";
import { iniciarFormularioAdmin } from "./pages/form_admin.js";
import { iniciarLogin } from "./pages/login.js";
import { iniciarCadastro } from "./pages/cadastro.js";
import { iniciarHeaderAdmin } from "./components/headerAdmin.js";
import { iniciarSidebarAdmin } from "./components/sidebarAdmin.js";
import { iniciarCarrinho } from "./pages/carrinho.js";
import { iniciarProdutoDetalhes } from "./pages/produto_detalhes.js";
import { iniciarConfiguracoes } from "./pages/configuracoes.js";

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
// CONFIGURAR FAVICON (ICONE DO NAVEGADOR)
// ===============================
function configurarFavicon() {
  let favicon = document.querySelector("link[rel='icon']");

  if (!favicon) {
    favicon = document.createElement("link");

    favicon.rel = "icon";

    document.head.appendChild(favicon);
  }

  favicon.href = "../img/logo_melior.jpeg";
}

// ===============================
// CARREGAR HEADER E FOOTER
// ===============================
async function carregarLayout() {
  async function carregarSeExistir(id, arquivo, callback) {
    const elemento = document.getElementById(id);
    elemento ? await loadComponent(id, arquivo) : null;

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

  await carregarSeExistir(
    "admin-header",
    "components/admin-header.html",
    iniciarHeaderAdmin,
  );

  await carregarSeExistir(
    "admin-sidebar",
    "components/admin-sidebar.html",
    iniciarSidebarAdmin,
  );
}

// ===============================
// START PRINCIPAL
// ===============================
async function start() {
  // Componentes Modularizados
  await configurarFavicon();
  await carregarLayout();
  await carregarIcones();

  // Se esta na home
  const isIndexPage = window.location.pathname.includes("index.html");
  if (isIndexPage) {
    iniciarHome();
  }

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

  const isLoginPage = window.location.pathname.includes("login.html");

  if (isLoginPage) {
    iniciarLogin();
  }

  const isCadastroPage = window.location.pathname.includes("cadastro.html");

  if (isCadastroPage) {
    iniciarCadastro();
  }

  const isConfiguracoesPage =
    window.location.pathname.includes("configuracoes.html");
  if (isConfiguracoesPage) {
    iniciarConfiguracoes();
  }

  const isCarrinhoPage = window.location.pathname.includes("carrinho.html");

  if (isCarrinhoPage) {
    iniciarCarrinho();
  }

  const isProdutoDetalhesPage = window.location.pathname.includes(
    "produto_detalhes.html",
  );

  if (isProdutoDetalhesPage) {
    iniciarProdutoDetalhes();
  }
}

// Inicialização do sistema
start();
