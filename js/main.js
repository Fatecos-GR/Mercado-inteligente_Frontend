// ==========================================
// 1. IMPORTS (Devem ficar sempre no topo!)
// ==========================================
import { iniciarHome } from "./pages/home.js";
import { iniciarPerfil } from "./pages/perfil.js";
import { iniciarGestao } from "./pages/gestao.js";
import { iniciarHeaderCliente } from "./components/headerClient.js";
import { iniciarFormularioAdmin } from "./pages/form_admin.js";
import { iniciarLogin } from "./pages/login.js";
import { iniciarCadastro } from "./pages/cadastro.js";
import { iniciarConfiguracoes } from "./pages/configuracoes.js";
import { iniciarHeaderAdmin } from "./components/headerAdmin.js";

// ==========================================
// 2. BANCO DE DADOS SIMULADO
// ==========================================
const bancoDeProdutos = [
  // HORTIFRUTI
  {
    id: "h1",
    nome: "Maçã Gala Nacional",
    preco: "R$ 8,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "h2",
    nome: "Banana Prata",
    preco: "R$ 5,50",
    imagem: "img/placeholder.png",
  },
  {
    id: "h3",
    nome: "Laranja Pera Rio 1kg",
    preco: "R$ 4,20",
    imagem: "img/placeholder.png",
  },
  {
    id: "h4",
    nome: "Tomate Italiano",
    preco: "R$ 7,90",
    imagem: "img/placeholder.png",
  },

  // AÇOUGUE
  {
    id: "a1",
    nome: "Patinho Bovino Moído",
    preco: "R$ 38,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "a2",
    nome: "Filé de Frango Swift",
    preco: "R$ 22,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "a3",
    nome: "Contra Filé Grill",
    preco: "R$ 54,00",
    imagem: "img/placeholder.png",
  },
  {
    id: "a4",
    nome: "Linguiça Toscana",
    preco: "R$ 19,90",
    imagem: "img/placeholder.png",
  },

  // PADARIA
  {
    id: "p1",
    nome: "Pão Francês Crocante",
    preco: "R$ 0,75",
    imagem: "img/placeholder.png",
  },
  {
    id: "p2",
    nome: "Bolo de Cenoura",
    preco: "R$ 18,50",
    imagem: "img/placeholder.png",
  },
  {
    id: "p3",
    nome: "Pão de Forma Integral",
    preco: "R$ 7,50",
    imagem: "img/placeholder.png",
  },
  {
    id: "p4",
    nome: "Sonho de Creme",
    preco: "R$ 4,50",
    imagem: "img/placeholder.png",
  },

  // LIMPEZA
  {
    id: "l1",
    nome: "Detergente Neutro",
    preco: "R$ 2,30",
    imagem: "img/placeholder.png",
  },
  {
    id: "l2",
    nome: "Sabão em Pó Omo 1.6kg",
    preco: "R$ 24,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "l3",
    nome: "Amaciante Downy",
    preco: "R$ 15,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "l4",
    nome: "Desinfetante Pinho Sol",
    preco: "R$ 8,90",
    imagem: "img/placeholder.png",
  },

  // MERCEARIA
  {
    id: "m1",
    nome: "Arroz Agulhinha T1 5kg",
    preco: "R$ 29,90",
    imagem: "img/placeholder.png",
  },
  {
    id: "m2",
    nome: "Feijão Carioca 1kg",
    preco: "R$ 7,50",
    imagem: "img/placeholder.png",
  },
  {
    id: "m3",
    nome: "Óleo de Soja 900ml",
    preco: "R$ 6,80",
    imagem: "img/placeholder.png",
  },
  {
    id: "m4",
    nome: "Açúcar Refinado 1kg",
    preco: "R$ 4,50",
    imagem: "img/placeholder.png",
  },
  {
    id: "m5",
    nome: "Café Torrado e Moído",
    preco: "R$ 14,90",
    imagem: "img/placeholder.png",
  },
];

// ==========================================
// 3. FUNÇÕES AUXILIARES (Utilitários)
// ==========================================
const Utils = {
  parsePreco: (precoStr) =>
    parseFloat(
      precoStr.replace("R$", "").trim().replace(".", "").replace(",", "."),
    ),
  formatPreco: (valorNum) => `R$ ${valorNum.toFixed(2).replace(".", ",")}`,
};

// ==========================================
// 4. COMPONENTES BASE E LAYOUT
// ==========================================
function carregarIcones() {
  if (document.querySelector("link[data-fontawesome]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

function configurarFavicon() {
  let favicon = document.querySelector("link[rel='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = "../img/logo_melior.jpeg";
}

// Função criada para carregar componentes dinâmicos de forma segura
async function carregarSeExistir(id, arquivo, callback = null) {
  const elemento = document.getElementById(id);
  if (elemento) {
    try {
      const res = await fetch(arquivo);
      const html = await res.text();
      elemento.innerHTML = html;
      if (callback) callback(); // Se houver uma função para rodar depois do load, ele roda
    } catch (e) {
      console.error(`Erro ao carregar o componente ${arquivo}:`, e);
    }
  }
}

// ==========================================
// 5. SISTEMA DE CARRINHO (Global)
// ==========================================
let carrinhoDeCompras = [];
try {
  carrinhoDeCompras = JSON.parse(localStorage.getItem("melior_carrinho")) || [];
} catch (e) {
  console.log("Carrinho vazio ou formato antigo limpo.");
}

window.adicionarAoCarrinho = function (idProduto, quantidade = 1) {
  const produto = bancoDeProdutos.find((p) => p.id === String(idProduto));
  if (!produto)
    return console.error("❌ Produto não encontrado! ID:", idProduto);

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
// 6. INICIALIZAÇÃO ESPECÍFICA DE PÁGINAS
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

    const precoNum = Utils.parsePreco(produto.preco);
    document.getElementById("detalhe-parcelamento").innerHTML =
      `ou 3x de <strong>${Utils.formatPreco(precoNum / 3)}</strong> sem juros no cartão`;

    const btnComprar = document.querySelector(".btn-buy-now");
    if (btnComprar) {
      btnComprar.addEventListener("click", () => {
        const qtd =
          parseInt(document.querySelector(".quantity-control input").value) ||
          1;
        window.adicionarAoCarrinho(idClicado, qtd);
      });
    }
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

function inicializarBotoesHome() {
  document.body.addEventListener("click", function (evento) {
    const botao = evento.target.closest(".btn-add-cart");
    if (botao) {
      evento.preventDefault();
      const idProduto = botao.getAttribute("data-id");
      if (idProduto) {
        window.adicionarAoCarrinho(idProduto, 1);
      }
    }
  });
}

// ==========================================
// 7. ORQUESTRADOR PRINCIPAL (Inicia tudo)
// ==========================================
async function start() {
  // Configurações Globais Iniciais
  configurarFavicon();
  carregarIcones();

  // Carrega Layouts Dinâmicos de forma segura
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
  await carregarSeExistir("admin-sidebar", "components/admin-sidebar.html");

  // Inicia Funcionalidades
  inicializarDetalhesProduto();
  inicializarControlesQuantidade();
  inicializarFiltros();
  renderizarTelaCarrinho();
  inicializarBotoesHome();
  window.atualizarHeaderCarrinho();

  // Sistema de Roteamento Simples (Detecta qual página o usuário está)
  const path = window.location.pathname;

  if (path.includes("index.html") || path === "/")
    try {
      iniciarHome();
    } catch (e) {}
  if (path.includes("perfil.html"))
    try {
      iniciarPerfil();
    } catch (e) {}
  if (path.includes("gestao.html"))
    try {
      iniciarGestao();
    } catch (e) {}
  if (path.includes("form_admin.html"))
    try {
      iniciarFormularioAdmin();
    } catch (e) {}
  if (path.includes("login.html"))
    try {
      iniciarLogin();
    } catch (e) {}
  if (path.includes("cadastro.html"))
    try {
      iniciarCadastro();
    } catch (e) {}
  if (path.includes("configuracoes.html"))
    try {
      iniciarConfiguracoes();
    } catch (e) {}

  console.log("✅ Sistema Melior Iniciado com Sucesso!");
}

// Garante que o start() só vai rodar depois que o HTML da tela estiver 100% pronto
document.addEventListener("DOMContentLoaded", start);
