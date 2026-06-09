// ======================================
// CARD DE PRODUTO
// ======================================

export function renderProdutoCard(produto) {
  const status =
    produto.estoqueDisponivel > 10 ? "Em estoque" : "Baixo estoque";

  const warningClass = produto.estoqueDisponivel <= 10 ? "warning" : "";

  return `
    <article class="product-card">

      <div class="product-card-top">

        <div class="product-icon">
          <i class="fa-solid fa-box"></i>
        </div>

        <div class="product-status ${warningClass}">
          ${status}
        </div>

      </div>

      <div class="product-info">

        <h3>${produto.nome}</h3>

        <span class="product-category">
          Categoria: ${produto.categoriaNome}
        </span>

        <span class="product-brand">
          Marca: ${produto.marcaNome}
        </span>

      </div>

      <div class="product-details">

        <div class="detail-item">
          <span>Preço</span>

          <strong>
            R$ ${produto.preco}
          </strong>
        </div>

        <div class="detail-item">
          <span>Quantidade</span>

          <strong>
            ${produto.estoqueDisponivel} un.
          </strong>
        </div>

      </div>

      <div class="product-actions">

        <a href="#" class="btn-edit">
          <i class="fa-solid fa-pen"></i>
          Editar
        </a>

        <a href="#" class="btn-delete">
          <i class="fa-solid fa-trash"></i>
          Excluir
        </a>

      </div>

    </article>
  `;
}
