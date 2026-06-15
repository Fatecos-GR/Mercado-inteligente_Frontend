// ======================================
// START
// ======================================

export function iniciarProdutoDetalhes() {
  carregarProduto();
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

async function carregarProduto() {
  const id = getProdutoId();

  if (!id) return;

  /*
    futuramente:
    const produto = await buscarProduto(id);
  */

  const produto = {
    id,
    nome: "Produto Exemplo",
    preco: 12.9,
    imagem: "/img/placeholder.png",
  };

  preencherTela(produto);
}

// ======================================
// PREENCHER TELA
// ======================================

function preencherTela(produto) {
  const titulo = document.getElementById("detalhe-titulo");

  const preco = document.getElementById("detalhe-preco");

  const imagem = document.getElementById("detalhe-imagem");

  if (titulo) titulo.textContent = produto.nome;

  if (preco) preco.textContent = `R$ ${produto.preco}`;

  if (imagem) {
    imagem.src = produto.imagem;

    imagem.alt = produto.nome;
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

  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1,
    });
  }

  localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));

  alert("Produto adicionado ao carrinho.");
}
