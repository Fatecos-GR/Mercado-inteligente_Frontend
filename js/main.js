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

document.addEventListener("DOMContentLoaded", () => {
  const selectOrdenacao = document.getElementById("ordenar-produtos");

  // Selecione o grid específico que você quer ordenar (pode precisar ajustar a classe/ID dependendo de onde colocou o filtro)
  const gridProdutos = document.querySelector(".products-grid");

  if (selectOrdenacao && gridProdutos) {
    selectOrdenacao.addEventListener("change", function () {
      // 1. Pega todos os cards de produto e transforma em um Array
      const cards = Array.from(gridProdutos.querySelectorAll(".product-card"));
      const valorSelecionado = this.value;

      // 2. Ordena o Array baseado na escolha
      cards.sort((a, b) => {
        // Pega os textos de preço
        const precoTextoA = a.querySelector(".price-current").innerText;
        const precoTextoB = b.querySelector(".price-current").innerText;

        // Limpa a formatação (ex: "R$ 49,90" vira 49.90)
        const precoA = parseFloat(
          precoTextoA
            .replace("R$", "")
            .trim()
            .replace(".", "")
            .replace(",", "."),
        );
        const precoB = parseFloat(
          precoTextoB
            .replace("R$", "")
            .trim()
            .replace(".", "")
            .replace(",", "."),
        );

        // Pega os títulos para a ordenação Alfabética
        const tituloA = a
          .querySelector(".product-title")
          .innerText.toLowerCase();
        const tituloB = b
          .querySelector(".product-title")
          .innerText.toLowerCase();

        // 3. Verifica qual filtro foi escolhido e faz o cálculo
        if (valorSelecionado === "menor-preco") {
          return precoA - precoB; // Crescente
        } else if (valorSelecionado === "maior-preco") {
          return precoB - precoA; // Decrescente
        } else if (valorSelecionado === "a-z") {
          return tituloA.localeCompare(tituloB); // Alfabética
        }

        return 0; // Mantém a ordem padrão se for "Selecione..."
      });

      // 4. Limpa o grid atual e injeta os cards reordenados
      gridProdutos.innerHTML = "";
      cards.forEach((card) => {
        gridProdutos.appendChild(card);
      });
    });
  }
});

// Inicialização
start();
