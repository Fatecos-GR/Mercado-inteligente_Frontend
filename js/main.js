// ==========================================
// 1. IMPORTS & BANCO DE DADOS SIMULADO
// ==========================================
import { iniciarHome } from "./pages/home.js";
import { iniciarPerfil } from "./pages/perfil.js";

const bancoDeProdutos = [
  {
    id: "1",
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
    id: "3",
    nome: "Categoria 3 - Produto Exemplo 3",
    preco: "R$ 89,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "4",
    nome: "Categoria 4 - Produto Exemplo 4",
    preco: "R$ 290,80",
    imagem: "img/placeholder.png",
  },
];

// ==========================================
// 2. FUNÇÕES AUXILIARES (Utilitários)
// ==========================================
const Utils = {
  // Transforma "R$ 45,90" em 45.90
  parsePreco: (precoStr) =>
    parseFloat(
      precoStr.replace("R$", "").trim().replace(".", "").replace(",", "."),
    ),
  // Transforma 45.90 em "R$ 45,90"
  formatPreco: (valorNum) => `R$ ${valorNum.toFixed(2).replace(".", ",")}`,
};

// ==========================================
// 3. COMPONENTES BASE (Header, Footer, Icons)
// ==========================================
async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

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

async function carregarLayout() {
  const componentes = [
    { id: "main-header", arquivo: "components/header.html" },
    { id: "main-footer", arquivo: "components/footer.html" },
    { id: "admin-header", arquivo: "components/admin-header.html" },
    { id: "admin-sidebar", arquivo: "components/admin-sidebar.html" },
  ];

  for (const comp of componentes) {
    if (document.getElementById(comp.id)) {
      await loadComponent(comp.id, comp.arquivo);
    }
  }
}

// ==========================================
// 4. SISTEMA DE CARRINHO (Global)
// ==========================================
let carrinhoDeCompras =
  JSON.parse(localStorage.getItem("melior_carrinho")) || [];

// Funções atreladas ao 'window' para funcionarem no onclick do HTML
window.adicionarAoCarrinho = function (idProduto, quantidade = 1) {
  const produto = bancoDeProdutos.find((p) => p.id === String(idProduto));
  if (!produto) return;

  const itemJaExiste = carrinhoDeCompras.find(
    (item) => item.id === String(idProduto),
  );

  if (itemJaExiste) {
    itemJaExiste.quantidade += quantidade;
  } else {
    carrinhoDeCompras.push({
      id: produto.id,
      nome: produto.nome,
      preco: Utils.parsePreco(produto.preco),
      imagem: produto.imagem,
      quantidade: quantidade,
    });
  }

  localStorage.setItem("melior_carrinho", JSON.stringify(carrinhoDeCompras));
  window.mostrarAviso(`${produto.nome} adicionado ao carrinho!`);

  renderizarTelaCarrinho();
  window.atualizarHeaderCarrinho();
};

window.alterarQtdCarrinho = function (index, mudanca) {
  if (carrinhoDeCompras[index].quantidade + mudanca > 0) {
    carrinhoDeCompras[index].quantidade += mudanca;
    localStorage.setItem("melior_carrinho", JSON.stringify(carrinhoDeCompras));
    renderizarTelaCarrinho();
    window.atualizarHeaderCarrinho();
  }
};

window.removerDoCarrinho = function (index) {
  carrinhoDeCompras.splice(index, 1);
  localStorage.setItem("melior_carrinho", JSON.stringify(carrinhoDeCompras));
  renderizarTelaCarrinho();
  window.atualizarHeaderCarrinho();
};

window.atualizarHeaderCarrinho = function () {
  const total = carrinhoDeCompras.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );
  const valorHeader = document.querySelector(".cart-value-box .value");
  if (valorHeader) valorHeader.innerText = total.toFixed(2).replace(".", ",");
};

window.mostrarAviso = function (mensagem) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${mensagem}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("esconder");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3000);
};

function renderizarTelaCarrinho() {
  const containerLista = document.getElementById("cart-items-list");
  const containerTotal = document.getElementById("total-carrinho");

  if (!containerLista || !containerTotal) return;

  if (carrinhoDeCompras.length === 0) {
    containerLista.innerHTML =
      '<p style="padding: 40px; text-align: center; color: #888;">Seu carrinho está vazio.</p>';
    containerTotal.innerText = "R$ 0,00";
    return;
  }

  containerLista.innerHTML = "";
  let totalGeral = 0;

  carrinhoDeCompras.forEach((item, index) => {
    const valorTotalItem = item.preco * item.quantidade;
    totalGeral += valorTotalItem;

    const article = document.createElement("article");
    article.className = "cart-item";
    article.innerHTML = `
      <div class="product-info">
        <img src="${item.imagem}" alt="${item.nome}" />
        <p class="product-name">${item.nome}</p>
      </div>
      <div class="quantity-controls">
        <div class="qty-wrapper">
          <button class="qty-btn" onclick="alterarQtdCarrinho(${index}, -1)"><i class="fas fa-minus"></i></button>
          <input type="number" value="${item.quantidade}" readonly />
          <button class="qty-btn" onclick="alterarQtdCarrinho(${index}, 1)"><i class="fas fa-plus"></i></button>
        </div>
        <button class="remove-btn" onclick="removerDoCarrinho(${index})"><i class="fas fa-trash-alt"></i> Remover</button>
      </div>
      <div class="value-info">
        <p class="item-price">${Utils.formatPreco(valorTotalItem)}</p>
        <small class="unit-price">${Utils.formatPreco(item.preco)} unid.</small>
      </div>
    `;
    containerLista.appendChild(article);
  });

  containerTotal.innerText = Utils.formatPreco(totalGeral);
}

// ==========================================
// 5. INICIALIZAÇÃO ESPECÍFICA DE PÁGINAS
// ==========================================
function inicializarDetalhesProduto() {
  const params = new URLSearchParams(window.location.search);
  const idClicado = params.get("id");

  if (!idClicado) return;

  const produto = bancoDeProdutos.find((p) => p.id === idClicado);

  if (produto) {
    document.getElementById("detalhe-titulo").innerText = produto.nome;
    document.getElementById("detalhe-preco").innerText = produto.preco;
    document.getElementById("detalhe-imagem").src = produto.imagem;
    document.getElementById("detalhe-imagem").alt = produto.nome;

    const precoNum = Utils.parsePreco(produto.preco);
    document.getElementById("detalhe-parcelamento").innerHTML =
      `ou 3x de <strong>${Utils.formatPreco(precoNum / 3)}</strong> sem juros no cartão`;

    // Conecta o botão de comprar da página de detalhes
    const btnComprar = document.querySelector(".btn-buy-now");
    if (btnComprar) {
      btnComprar.onclick = () => {
        const qtd =
          parseInt(document.querySelector(".quantity-control input").value) ||
          1;
        window.adicionarAoCarrinho(idClicado, qtd);
      };
    }
  } else {
    document.getElementById("detalhe-titulo").innerText =
      "Produto não encontrado";
    document.getElementById("detalhe-preco").innerText = "---";
  }
}

function inicializarControlesQuantidade() {
  const btnDiminuir = document.querySelector(
    '.qty-btn[aria-label="Diminuir quantidade"]',
  );
  const btnAumentar = document.querySelector(
    '.qty-btn[aria-label="Aumentar quantidade"]',
  );
  const campoQtd = document.querySelector(".quantity-control input");

  if (btnDiminuir && btnAumentar && campoQtd) {
    btnAumentar.addEventListener(
      "click",
      () => (campoQtd.value = parseInt(campoQtd.value) + 1),
    );
    btnDiminuir.addEventListener("click", () => {
      if (parseInt(campoQtd.value) > 1)
        campoQtd.value = parseInt(campoQtd.value) - 1;
    });
  }
}

function inicializarFiltros() {
  const selectOrd = document.getElementById("ordenar-produtos");
  const grid = document.querySelector(".products-grid");

  if (selectOrd && grid) {
    selectOrd.addEventListener("change", function () {
      const cards = Array.from(grid.querySelectorAll(".product-card"));

      cards.sort((a, b) => {
        const precoA = Utils.parsePreco(
          a.querySelector(".price-current").innerText,
        );
        const precoB = Utils.parsePreco(
          b.querySelector(".price-current").innerText,
        );
        const tituloA = a
          .querySelector(".product-title")
          .innerText.toLowerCase();
        const tituloB = b
          .querySelector(".product-title")
          .innerText.toLowerCase();

        if (this.value === "menor-preco") return precoA - precoB;
        if (this.value === "maior-preco") return precoB - precoA;
        if (this.value === "a-z") return tituloA.localeCompare(tituloB);
        return 0;
      });

      grid.innerHTML = "";
      cards.forEach((card) => grid.appendChild(card));
    });
  }
}

// ==========================================
// 6. START DA APLICAÇÃO
// ==========================================
async function start() {
  await carregarLayout();
  carregarIcones();

  // Garante que o header seja atualizado após o carregamento do layout
  window.atualizarHeaderCarrinho();

  const path = window.location.pathname;
  if (path.includes("index.html") || path === "/") iniciarHome();
  if (path.includes("perfil.html")) iniciarPerfil();
}

// Ouve o carregamento da página inteira
document.addEventListener("DOMContentLoaded", () => {
  inicializarDetalhesProduto();
  inicializarControlesQuantidade();
  inicializarFiltros();
  renderizarTelaCarrinho();

  start();
});
