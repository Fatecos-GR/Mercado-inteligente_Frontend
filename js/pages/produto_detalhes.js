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
// MAPEAMENTO DE CATEGORIAS
// ======================================
function getNomeCategoria(id) {
    const mapping = {
        "h": "Hortifruti",
        "a": "Açougue",
        "p": "Padaria",
        "b": "Bebidas",
        "l": "Limpeza",
        "i": "Higiene",
        "ps": "Pet Shop",
        "c": "Congelados",
        "m": "Mercearia"
    };

    // Pega as letras antes dos números no ID (ex: "ps1" -> "ps")
    const prefix = id.replace(/[0-9]/g, '');
    return mapping[prefix] || "Produto";
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
  const unidade = document.getElementById("detalhe-unidade");
  const categoriaTexto = document.getElementById("detalhe-categoria-texto");

  if (titulo) titulo.textContent = produto.nome;
  if (preco) preco.textContent = produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  if (imagem) {
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
  }

  if (unidade) {
      unidade.textContent = produto.unidade || "unid";
  }

  if (categoriaTexto) {
      categoriaTexto.textContent = getNomeCategoria(produto.id);
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
    const originalContent = btnComprar.innerHTML;
    btnComprar.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    btnComprar.style.backgroundColor = "var(--verde-primario)";
    
    setTimeout(() => {
      btnComprar.innerHTML = originalContent;
      btnComprar.style.backgroundColor = "";
    }, 2000);
  }

  atualizarCarrinhoHeader();
  mostrarToastProduto(produto.nome);
}
