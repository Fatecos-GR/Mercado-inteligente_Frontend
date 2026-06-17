import { produtosMock } from "../data/produtosMock.js";
import { atualizarCarrinhoHeader, mostrarToastProduto } from "../components/headerClient.js";

// ======================================
// START
// ======================================

export function iniciarProdutoDetalhes() {
  carregarProduto();
  configurarControlesQuantidade();
}

// ======================================
// CONTROLES DE QUANTIDADE
// ======================================

function configurarControlesQuantidade() {
  const btnMinus = document.querySelector('button[aria-label="Diminuir quantidade"]');
  const btnPlus = document.querySelector('button[aria-label="Aumentar quantidade"]');
  const inputQty = document.querySelector('.quantity-control input');

  if (!btnMinus || !btnPlus || !inputQty) return;

  btnMinus.addEventListener("click", () => {
    let currentValue = parseInt(inputQty.value) || 1;
    if (currentValue > 1) {
      inputQty.value = currentValue - 1;
    }
  });

  btnPlus.addEventListener("click", () => {
    let currentValue = parseInt(inputQty.value) || 1;
    inputQty.value = currentValue + 1;
  });
}

// ======================================
// OBTER ID
// ======================================

function getProdutoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ======================================
// CARREGAR PRODUTO
// ======================================

function carregarProduto() {
  const id = getProdutoId();

  if (!id) return;

  const produto = produtosMock.find((p) => p.id === id);

  if (!produto) {
    const titulo = document.getElementById("detalhe-titulo");
    if (titulo) titulo.textContent = "Produto não encontrado";
    return;
  }

  preencherTela(produto);
}

// ======================================
// PREENCHER TELA
// ======================================

function preencherTela(produto) {
  const titulo = document.getElementById("detalhe-titulo");
  const preco = document.getElementById("detalhe-preco");
  const imagem = document.getElementById("detalhe-imagem");
  const parcelamento = document.getElementById("detalhe-parcelamento");

  if (titulo) titulo.textContent = produto.nome;
  if (preco) preco.textContent = `R$ ${produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  if (imagem) {
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
  }

  if (parcelamento) {
    const valorParcela = (produto.preco / 3).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    parcelamento.innerHTML = `ou 3x de <strong>R$ ${valorParcela}</strong> sem juros no cartão`;
  }

  configurarBotaoComprar(produto);
}

// ======================================
// COMPRAR
// ======================================

function configurarBotaoComprar(produto) {
  const btnComprar = document.querySelector(".btn-buy-now");

  if (!btnComprar) return;

  btnComprar.addEventListener("click", () => {
    adicionarAoCarrinho(produto);
  });
}

// ======================================
// ADICIONAR AO CARRINHO
// ======================================

function adicionarAoCarrinho(produto) {
  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];
  const existente = carrinho.find((item) => item.id === produto.id);
  
  const inputQty = document.querySelector('.quantity-control input');
  const qtdAdicional = parseInt(inputQty ? inputQty.value : "1") || 1;

  if (existente) {
    existente.quantidade += qtdAdicional;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: qtdAdicional,
    });
  }

  localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));

  const btnComprar = document.querySelector(".btn-buy-now");
  if (btnComprar) {
    btnComprar.innerHTML = '<i class="fas fa-check"></i> Adicionado';
    setTimeout(() => {
      btnComprar.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar';
    }, 1500);
  }

  atualizarCarrinhoHeader();
  mostrarToastProduto(produto.nome);
}
