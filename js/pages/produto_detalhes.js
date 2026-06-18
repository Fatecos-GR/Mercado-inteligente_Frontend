import { buscarProdutoPorId } from "../services/api.js";

import {
  atualizarCarrinhoHeader,
  mostrarToastProduto,
} from "../components/headerClient.js";

import { aplicarMascaraCEP } from "../utils/mascaras.js";

// ======================================
// CONTROLES DE QUANTIDADE
// ======================================

function configurarControlesQuantidade() {
  const btnMinus = document.querySelector(
    'button[aria-label="Diminuir quantidade"]',
  );
  const btnPlus = document.querySelector(
    'button[aria-label="Aumentar quantidade"]',
  );
  const inputQty = document.querySelector(".quantity-control input");

  if (!btnMinus || !btnPlus || !inputQty) return;

  btnMinus.addEventListener("click", () => {
    let value = parseInt(inputQty.value) || 1;
    if (value > 1) inputQty.value = value - 1;
  });

  btnPlus.addEventListener("click", () => {
    let value = parseInt(inputQty.value) || 1;
    inputQty.value = value + 1;
  });
}

// ======================================
// PEGAR ID DA URL
// ======================================

function getProdutoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ======================================
// CARREGAR PRODUTO (API REAL)
// ======================================

async function carregarProduto() {
  const id = getProdutoId();

  if (!id) return;

  try {
    const produto = await buscarProdutoPorId(id);

    if (!produto) {
      mostrarErro();
      return;
    }

    preencherTela(produto);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    mostrarErro();
  }
}

// ======================================
// ERRO
// ======================================

function mostrarErro() {
  const titulo = document.getElementById("detalhe-titulo");
  if (titulo) titulo.textContent = "Produto não encontrado";
}

// ======================================
// PREENCHER TELA
// ======================================

function preencherTela(produto) {
  const titulo = document.getElementById("detalhe-titulo");
  const preco = document.getElementById("detalhe-preco");
  const imagem = document.getElementById("detalhe-imagem");
  const parcelamento = document.getElementById("detalhe-parcelamento");
  const unidade = document.getElementById("detalhe-unidade");
  const categoriaTexto = document.getElementById("detalhe-categoria-texto");

  if (titulo) titulo.textContent = produto.nome;

  if (preco) {
    preco.textContent = Number(produto.preco).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (imagem) {
    const img = produto.imagem?.trim();

    imagem.src = img && img.length > 0 ? img : "/img/placeholder.png";

    imagem.alt = produto.nome;
  }

  if (unidade) {
    unidade.textContent = produto.unidade || "unid";
  }

  if (categoriaTexto) {
    categoriaTexto.textContent = produto.categoriaNome || "Categoria";
  }

  if (parcelamento) {
    const valorParcela = (produto.preco / 3).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    parcelamento.innerHTML = `ou 3x de <strong>R$ ${valorParcela}</strong> sem juros no cartão`;
  }

  configurarBotaoComprar(produto);
}

// ======================================
// BOTÃO COMPRAR
// ======================================

function configurarBotaoComprar(produto) {
  const btnComprar = document.querySelector(".btn-buy-now");

  if (!btnComprar) return;

  btnComprar.addEventListener("click", () => {
    adicionarAoCarrinho(produto);
  });
}

// ======================================
// CARRINHO
// ======================================

function adicionarAoCarrinho(produto) {
  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];

  const existente = carrinho.find((item) => item.id === produto.id);

  const inputQty = document.querySelector(".quantity-control input");
  const qtd = parseInt(inputQty?.value || "1");

  if (existente) {
    existente.quantidade += qtd;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: qtd,
    });
  }

  localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));

  atualizarCarrinhoHeader();
  mostrarToastProduto(produto.nome);

  const btn = document.querySelector(".btn-buy-now");

  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = "Adicionado ✓";

    setTimeout(() => {
      btn.innerHTML = original;
    }, 1500);
  }
}

function configurarCEP() {
  const cepInput = document.getElementById("cep-input");

  if (!cepInput) return;

  aplicarMascaraCEP(cepInput);
}

// ======================================
// START
// ======================================

export function iniciarProdutoDetalhes() {
  carregarProduto();
  configurarControlesQuantidade();
  configurarCEP();
}
