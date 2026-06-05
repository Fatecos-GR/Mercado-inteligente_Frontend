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

/* ===============================
   BANCO DE DADOS SIMULADO (Melior)
=============================== */
const bancoDeProdutos = [
  {
    id: "1", // O ID que passamos no link da página principal
    nome: "Categoria 1 - Produto Exemplo 1",
    preco: "R$ 45,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "2",
    nome: "Categoria 2 - Produto Exemplo 2",
    preco: "R$ 120,00",
    imagem: "img/placeholder.png",
  },
  {
    id: "3", // Link do exemplo que você criou no HTML anterior
    nome: "Categoria 3 - Produto Exemplo 3",
    preco: "R$ 89,90",
    imagem: "img/placeholder.png", // Troque pelo caminho real da foto da picanha
  },
  {
    id: "4",
    nome: "Categoria 4 - Produto Exemplo 4",
    preco: "R$ 290,80",
    imagem: "img/placeholder.png",
  },
];

/* ===============================
   CONTROLE DE QUANTIDADE (+ e -)
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  // Pega os elementos na tela
  const btnDiminuir = document.querySelector(
    '.qty-btn[aria-label="Diminuir quantidade"]',
  );
  const btnAumentar = document.querySelector(
    '.qty-btn[aria-label="Aumentar quantidade"]',
  );
  const campoQuantidade = document.querySelector(".quantity-control input");

  // Verifica se estamos na página de detalhes (onde esses botões existem)
  if (btnDiminuir && btnAumentar && campoQuantidade) {
    // Ação do botão de Aumentar (+)
    btnAumentar.addEventListener("click", () => {
      let valorAtual = parseInt(campoQuantidade.value);
      campoQuantidade.value = valorAtual + 1;
    });

    // Ação do botão de Diminuir (-)
    btnDiminuir.addEventListener("click", () => {
      let valorAtual = parseInt(campoQuantidade.value);
      // Só diminui se o valor for maior que 1 (ninguém compra 0 ou -1 produtos)
      if (valorAtual > 1) {
        campoQuantidade.value = valorAtual - 1;
      }
    });
  }
});

/* ===============================
   CARREGAMENTO DINÂMICO DA PÁGINA
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  // Pega o ID que veio na URL (ex: detalhes_prod.html?id=4)
  const parametrosURL = new URLSearchParams(window.location.search);
  const idClicado = parametrosURL.get("id");

  // Se existir um ID na URL, vamos procurar no nosso banco de dados
  if (idClicado) {
    const produtoEncontrado = bancoDeProdutos.find(
      (produto) => produto.id === idClicado,
    );

    if (produtoEncontrado) {
      document.getElementById("detalhe-titulo").innerText =
        produtoEncontrado.nome;
      document.getElementById("detalhe-preco").innerText =
        produtoEncontrado.preco;

      const imagemElement = document.getElementById("detalhe-imagem");
      imagemElement.src = produtoEncontrado.imagem;
      imagemElement.alt = produtoEncontrado.nome;

      // ... código anterior ...
      document.getElementById("detalhe-titulo").innerText =
        produtoEncontrado.nome;
      document.getElementById("detalhe-preco").innerText =
        produtoEncontrado.preco;

      // --- NOVO: CÁLCULO DA PARCELA ---
      // 1. Pega o preço (ex: "R$ 45,90"), tira o "R$", troca vírgula por ponto e converte para número
      const precoNumero = parseFloat(
        produtoEncontrado.preco
          .replace("R$", "")
          .trim()
          .replace(".", "")
          .replace(",", "."),
      );

      // 2. Divide por 3
      const valorParcela = precoNumero / 3;

      // 3. Formata de volta para o padrão de dinheiro do Brasil e injeta na tela
      document.getElementById("detalhe-parcelamento").innerHTML =
        `ou 3x de <strong>R$ ${valorParcela.toFixed(2).replace(".", ",")}</strong> sem juros no cartão`;
      // --------------------------------
    } else {
      // Caso o ID digitado não exista no banco de dados
      document.getElementById("detalhe-titulo").innerText =
        "Produto não encontrado";
      document.getElementById("detalhe-preco").innerText = "---";
    }
  }
});

// Inicialização
start();
