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
        Seu carrinho estÃ¡ vazio.
      </p>
    `;

    total.textContent = "R$ 0,00";

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

          </div>

          <div class="value-info">

            <strong>
              R$ ${subtotal.toFixed(2)}
            </strong>

          </div>

        </article>
      `;
    })
    .join("");

  total.textContent = `R$ ${valorTotal.toFixed(2)}`;

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
}
