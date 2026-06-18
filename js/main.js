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
import { iniciarCarrinho } from "./pages/carrinho.js";
import { iniciarProdutoDetalhes } from "./pages/produto_detalhes.js";
import { iniciarConfiguracoes } from "./pages/configuracoes.js";
import { iniciarHeaderAdmin } from "./components/headerAdmin.js";
import { iniciarSidebarAdmin } from "./components/sidebarAdmin.js";

console.log("Sistema: main.js carregado.");

// ===============================
// FUNÇÃO AUXILIAR PARA CARREGAR OS COMPONENTES HTML
// ===============================
async function loadComponent(id, file) {
  try {
    console.log(`Sistema: Tentando carregar ${file} em #${id}...`);
    const res = await fetch(file);
    if (!res.ok) {
        console.warn(`Sistema: Falha ao buscar ${file} (Status: ${res.status}).`);
        return false;
    }
    const html = await res.text();
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = html;
      console.log(`Sistema: Componente ${file} injetado com sucesso.`);
      return true;
    }
    console.warn(`Sistema: Elemento #${id} não encontrado no DOM.`);
    return false;
  } catch (error) {
    console.error(`Sistema: Erro ao carregar ${file}:`, error);
    return false;
  }
}

// ===============================
// CARREGAR HEADER E FOOTER
// ===============================
async function carregarLayout() {
  console.log("Sistema: Iniciando carregamento do layout...");
  
  // Header Cliente
  const header = document.getElementById("main-header");
  if (header) {
    const ok = await loadComponent("main-header", "components/header.html");
    if (ok) {
        try {
            iniciarHeaderCliente();
            console.log("Sistema: Header Cliente inicializado.");
        } catch (e) {
            console.error("Sistema: Erro ao inicializar Header Cliente:", e);
        }
    }
  }

  // Footer
  if (document.getElementById("main-footer")) {
    await loadComponent("main-footer", "components/footer.html");
  }

  // Admin Header
  if (document.getElementById("admin-header")) {
    const ok = await loadComponent("admin-header", "components/admin-header.html");
    if (ok) iniciarHeaderAdmin();
  }

  // Admin Sidebar
  if (document.getElementById("admin-sidebar")) {
    const ok = await loadComponent("admin-sidebar", "components/admin-sidebar.html");
    if (ok) iniciarSidebarAdmin();
  }
}

// ===============================
// START PRINCIPAL
// ===============================
async function start() {
  console.log("Sistema: Iniciando start()...");
  
  // Favicon e Ícones (Não bloqueantes)
  try {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = "img/logo_melior.jpeg";
    
    if (!document.querySelector("link[data-fontawesome]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
      link.setAttribute("data-fontawesome", "true");
      document.head.appendChild(link);
    }
  } catch (e) { console.warn("Sistema: Erro ao carregar ícones/favicon."); }

  // Carrega o layout
  await carregarLayout();

  // Detecção de Página
  const path = window.location.pathname;
  console.log(`Sistema: Rota detectada: ${path}`);

  if (path === "/" || path.endsWith("index.html") || path.endsWith("/")) {
    console.log("Sistema: Inicializando Home...");
    iniciarHome();
  }

  // Outras rotas
  if (path.includes("perfil.html")) iniciarPerfil();
  if (path.includes("gestao.html")) iniciarGestao();
  if (path.includes("form_admin.html")) iniciarFormularioAdmin();
  if (path.includes("login.html")) iniciarLogin();
  if (path.includes("cadastro.html")) iniciarCadastro();
  if (path.includes("configuracoes.html")) iniciarConfiguracoes();
  if (path.includes("carrinho.html")) iniciarCarrinho();
  if (path.includes("detalhes_prod.html")) iniciarProdutoDetalhes();
}

// Inicialização
start();
