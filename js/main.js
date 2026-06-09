// ==========================================
// 1. IMPORTS & BANCO DE DADOS SIMULADO
// ==========================================
import { iniciarHome } from "./pages/home.js";
import { iniciarPerfil } from "./pages/perfil.js";

const bancoDeProdutos = [
  // Hortifruti
  { id: "h1", nome: "Maçã Gala Nacional", preco: "R$ 8,90", imagem: "img/placeholder.png" },
  { id: "h2", nome: "Banana Prata", preco: "R$ 5,50", imagem: "img/placeholder.png" },
  { id: "h3", nome: "Laranja Pera Rio 1kg", preco: "R$ 4,20", imagem: "img/placeholder.png" },
  { id: "h4", nome: "Tomate Italiano", preco: "R$ 7,90", imagem: "img/placeholder.png" },
  
  // Açougue
  { id: "a1", nome: "Patinho Bovino Moído", preco: "R$ 38,90", imagem: "img/placeholder.png" },
  { id: "a2", nome: "Filé de Frango Swift", preco: "R$ 22,90", imagem: "img/placeholder.png" },
  { id: "a3", nome: "Contra Filé Grill", preco: "R$ 54,00", imagem: "img/placeholder.png" },
  { id: "a4", nome: "Linguiça Toscana", preco: "R$ 19,90", imagem: "img/placeholder.png" },
  
  // Padaria
  { id: "p1", nome: "Pão Francês Crocante", preco: "R$ 0,75", imagem: "img/placeholder.png" },
  { id: "p2", nome: "Bolo de Cenoura", preco: "R$ 18,50", imagem: "img/placeholder.png" },
  { id: "p3", nome: "Pão de Forma Integral", preco: "R$ 7,50", imagem: "img/placeholder.png" },
  { id: "p4", nome: "Sonho de Creme", preco: "R$ 4,50", imagem: "img/placeholder.png" },
  
  // Limpeza
  { id: "l1", nome: "Detergente Neutro", preco: "R$ 2,30", imagem: "img/placeholder.png" },
  { id: "l2", nome: "Sabão em Pó Omo 1.6kg", preco: "R$ 24,90", imagem: "img/placeholder.png" },
  { id: "l3", nome: "Amaciante Downy", preco: "R$ 15,90", imagem: "img/placeholder.png" },
  { id: "l4", nome: "Desinfetante Pinho Sol", preco: "R$ 8,90", imagem: "img/placeholder.png" },
  
  // Mercearia
  { id: "m1", nome: "Arroz Agulhinha T1 5kg", preco: "R$ 29,90", imagem: "img/placeholder.png" },
  { id: "m2", nome: "Feijão Carioca 1kg", preco: "R$ 7,50", imagem: "img/placeholder.png" },
  { id: "m3", nome: "Óleo de Soja 900ml", preco: "R$ 6,80", imagem: "img/placeholder.png" },
  { id: "m4", nome: "Açúcar Refinado 1kg", preco: "R$ 4,50", imagem: "img/placeholder.png" },
  { id: "m5", nome: "Café Torrado e Moído", preco: "R$ 14,90", imagem: "img/placeholder.png" },
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
  const customSelect = document.getElementById("sort-select");
  if (!customSelect) return;

  const trigger = customSelect.querySelector(".select-trigger");
  const options = customSelect.querySelectorAll(".option");
  const triggerText = trigger.querySelector("span");

  // Toggle do menu
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    customSelect.classList.toggle("open");
  });

  // Fecha ao clicar fora
  document.addEventListener("click", () => customSelect.classList.remove("open"));

  // Lógica de seleção e ordenação
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const val = opt.dataset.value;
      const label = opt.innerText;

      // Atualiza visual
      options.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      triggerText.innerText = label;
      customSelect.classList.remove("open");

      // Executa a ordenação
      const grids = document.querySelectorAll(".products-grid");
      grids.forEach((grid) => {
        const cards = Array.from(grid.querySelectorAll(".product-card"));
        if (cards.length === 0) return;

        cards.sort((a, b) => {
          const priceElA = a.querySelector(".price-current");
          const priceElB = b.querySelector(".price-current");
          if (!priceElA || !priceElB) return 0;

          const precoA = Utils.parsePreco(priceElA.innerText);
          const precoB = Utils.parsePreco(priceElB.innerText);
          const tituloA = a.querySelector(".product-title").innerText.toLowerCase();
          const tituloB = b.querySelector(".product-title").innerText.toLowerCase();

          if (val === "menor-preco") return precoA - precoB;
          if (val === "maior-preco") return precoB - precoA;
          if (val === "a-z") return tituloA.localeCompare(tituloB);
          return 0;
        });

        grid.innerHTML = "";
        cards.forEach((card) => grid.appendChild(card));
      });
    });
  });
}

// ==========================================
// 6. START DA APLICAÇÃO
// ==========================================
async function start() {
  await carregarLayout();
  carregarIcones();

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
      const secoes = document.querySelectorAll(".vitrine-title, #recommendations-header h2");

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
