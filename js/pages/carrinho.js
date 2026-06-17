import { atualizarCarrinhoHeader } from "../components/headerClient.js";

// ======================================
// START CARRINHO
// ======================================

export function iniciarCarrinho() {
  console.log("Carrinho iniciado");

  renderizarCarrinho();
}

// ======================================
// RENDERIZAR CARRINHO
// ======================================

function renderizarCarrinho() {
  const lista = document.getElementById("cart-items-list");

  const total = document.getElementById("total-carrinho");

  if (!lista || !total) return;

  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];

  if (carrinho.length === 0) {
    lista.innerHTML = `
      <p class="cart-empty">
        Seu carrinho está vazio.
      </p>
    `;

    total.textContent = "R$ 0,00";
    atualizarCarrinhoHeader();
    return;
  }

  let valorTotal = 0;

  lista.innerHTML = carrinho
    .map((item, index) => {
      const subtotal = item.preco * item.quantidade;

      valorTotal += subtotal;

      return `
        <article class="cart-item">

          <div class="product-info">

            <img
              src="${item.imagem}"
              alt="${item.nome}"
            />

            <p class="product-name">
              ${item.nome}
            </p>

          </div>

          <div class="quantity-controls">

            <button
              class="btn-diminuir"
              data-index="${index}"
            >
              -
            </button>

            <span>
              ${item.quantidade}
            </span>

            <button
              class="btn-aumentar"
              data-index="${index}"
            >
              +
            </button>

            <button class="btn-remover" data-index="${index}" title="Remover item">
              <i class="fas fa-trash"></i>
            </button>

          </div>

          <div class="value-info">

            <strong>
              R$ ${subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>

          </div>

        </article>
      `;
    })
    .join("");

  total.textContent = `R$ ${valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  configurarEventosCarrinho();
}

// ======================================
// EVENTOS
// ======================================

function configurarEventosCarrinho() {
  document.querySelectorAll(".btn-aumentar").forEach((btn) => {
    btn.addEventListener("click", () => {
      alterarQuantidade(btn.dataset.index, 1);
    });
  });

  document.querySelectorAll(".btn-diminuir").forEach((btn) => {
    btn.addEventListener("click", () => {
      alterarQuantidade(btn.dataset.index, -1);
    });
  });

  document.querySelectorAll(".btn-remover").forEach((btn) => {
    btn.addEventListener("click", () => {
      removerItem(btn.dataset.index);
    });
  });
}

// ======================================
// REMOVER ITEM
// ======================================

function removerItem(index) {
  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];

  carrinho.splice(index, 1);

  localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));

  renderizarCarrinho();
  atualizarCarrinhoHeader();
}

// ======================================
// ALTERAR QUANTIDADE
// ======================================

function alterarQuantidade(index, delta) {
  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];

  const item = carrinho[index];

  if (!item) return;

  item.quantidade += delta;

  if (item.quantidade <= 0) {
    carrinho.splice(index, 1);
  }

  localStorage.setItem("melior_carrinho", JSON.stringify(carrinho));

  renderizarCarrinho();
  atualizarCarrinhoHeader();
}
