import { buscarProdutoPorId } from "../services/api.js";

import {
  atualizarCarrinhoHeader,
  mostrarToastProduto,
} from "../components/headerClient.js";

import { aplicarMascaraCEP } from "../utils/mascaras.js";

function configurarLimiteQuantidade(estoqueDisponivel) {
  const estoqueLabel = document.getElementById("detalhe-estoque");
  const input = document.querySelector(".quantity-control input");
  const btnPlus = document.querySelector(
    'button[aria-label="Aumentar quantidade"]',
  );
  const btnMinus = document.querySelector(
    'button[aria-label="Diminuir quantidade"]',
  );
  const btnComprar = document.querySelector(".btn-buy-now");

  const estoque = Number(estoqueDisponivel ?? 0);

  // UI do estoque
  if (estoqueLabel) {
    estoqueLabel.textContent =
      estoque > 0
        ? `${estoque} unidade(s) disponível(is) em estoque`
        : "Produto sem estoque disponível";

    estoqueLabel.style.color = estoque > 0 ? "var(--verde-escuro)" : "#e53e3e";
  }

  // ❌ SEM ESTOQUE = TRAVA TUDO
  if (estoque <= 0) {
    input.value = 0;
    input.disabled = true;
    btnPlus.disabled = true;
    btnMinus.disabled = true;

    if (btnComprar) {
      btnComprar.disabled = true;
      btnComprar.textContent = "Sem estoque";
    }

    return;
  }

  const limitar = () => {
    let val = parseInt(input.value) || 1;

    if (val > estoque) val = estoque;
    if (val < 1) val = 1;

    input.value = val;
  };

  btnPlus.addEventListener("click", () => {
    let current = parseInt(input.value) || 1;

    if (current < estoque) {
      input.value = current + 1;
    }
  });

  btnMinus.addEventListener("click", () => {
    let current = parseInt(input.value) || 1;

    if (current > 1) {
      input.value = current - 1;
    }
  });

  input.addEventListener("input", limitar);
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

  if (unidade) unidade.textContent = produto.unidade || "unid";
  if (categoriaTexto)
    categoriaTexto.textContent = produto.categoriaNome || "Categoria";

  if (parcelamento) {
    const valorParcela = (produto.preco / 3).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    parcelamento.innerHTML = `ou 3x de <strong>R$ ${valorParcela}</strong> sem juros no cartão`;
  }

  configurarLimiteQuantidade(produto.estoqueDisponivel);
  configurarBotaoComprar(produto);
}

// ======================================
// BOTÃO COMPRAR
// ======================================

function configurarBotaoComprar(produto) {
  const btnComprar = document.querySelector(".btn-buy-now");

  if (!btnComprar) return;

  btnComprar.addEventListener("click", () => {
    const estoque = Number(produto.estoqueDisponivel ?? 0);

    if (estoque <= 0) {
      mostrarToastProduto("Produto sem estoque disponível");
      return;
    }

    const inputQty = document.querySelector(".quantity-control input");
    const qtd = parseInt(inputQty?.value || "1");

    const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];

    const existente = carrinho.find((item) => item.id === produto.id);
    const atual = existente ? existente.quantidade : 0;

    if (atual + qtd > estoque) {
      mostrarToastProduto(`Estoque máximo: ${estoque}`);
      return;
    }

    adicionarAoCarrinho(produto);
  });
}

// ======================================
// CARRINHO
// ======================================

function adicionarAoCarrinho(produto) {
  const inputQty = document.querySelector(".quantity-control input");
  const qtdAdicional = parseInt(inputQty ? inputQty.value : "1") || 1;

  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];

  const itemExistente = carrinho.find((item) => item.id === produto.id);
  const qtdAtual = itemExistente ? itemExistente.quantidade : 0;

  const totalDesejado = qtdAtual + qtdAdicional;

  const estoque = Number(produto.estoqueDisponivel ?? 0);

  // 🔒 REGRA FINAL DE SEGURANÇA
  if (estoque <= 0) {
    mostrarToastProduto("Produto sem estoque disponível");
    return;
  }

  if (totalDesejado > estoque) {
    mostrarToastProduto(
      `Limite de estoque atingido (${estoque} unidades disponíveis)`,
    );
    return;
  }

  if (itemExistente) {
    itemExistente.quantidade = totalDesejado;
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
  configurarCEP();
}
