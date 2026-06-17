import {
  buscarEstatisticas,
  buscarMarcasEQuantidade,
  buscarFornecedorEQuantidade,
  buscarCategoriasEQuantidade,
  buscarQuantidadeProdutosBaixoEstoque,
  buscarQuantidadeTotalProdutosEstoque,
  buscarQuantidadeDeCadaProduto,
} from "../services/api.js";

export async function iniciarDashboard() {
  try {
    const [
      estatisticas,
      marcas,
      fornecedores,
      categorias,
      baixoEstoque,
      estoqueTotal,
      produtos,
    ] = await Promise.all([
      buscarEstatisticas(),
      buscarMarcasEQuantidade(),
      buscarFornecedorEQuantidade(),
      buscarCategoriasEQuantidade(),
      buscarQuantidadeProdutosBaixoEstoque(),
      buscarQuantidadeTotalProdutosEstoque(),
      buscarQuantidadeDeCadaProduto(),
    ]);

    preencherCards(estatisticas, baixoEstoque, estoqueTotal);

    renderProdutos(produtos);

    renderGraficoCategorias(categorias);

    renderGraficoMarcas(marcas);

    renderGraficoFornecedores(fornecedores);
  } catch (erro) {
    console.error(erro);
  }
}

function preencherCards(estatisticas, baixoEstoque, estoqueTotal) {
  document.getElementById("total-produtos").textContent =
    estatisticas.quantidadeProdutos;

  document.getElementById("baixo-estoque").textContent = baixoEstoque.length;

  document.getElementById("estoque-total").textContent = estoqueTotal;
}

function renderProdutos(produtos) {
  const container = document.getElementById("dashboard-produtos-lista");

  container.innerHTML = produtos
    .map(
      (produto) => `
        <div class="produto-row">
          <strong>${produto.nome}</strong>

          <span>${produto.quantidade}</span>
        </div>
      `,
    )
    .join("");
}

function renderGraficoCategorias(dados) {
  new Chart(document.getElementById("chart-categorias"), {
    type: "bar",

    data: {
      labels: dados.map((x) => x.nome),

      datasets: [
        {
          data: dados.map((x) => x.quantidade),
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function renderGraficoMarcas(dados) {
  new Chart(document.getElementById("chart-marcas"), {
    type: "doughnut",

    data: {
      labels: dados.map((x) => x.nome),

      datasets: [
        {
          data: dados.map((x) => x.quantidade),
        },
      ],
    },
  });
}

function renderGraficoFornecedores(dados) {
  new Chart(document.getElementById("chart-fornecedores"), {
    type: "pie",

    data: {
      labels: dados.map((x) => x.nome),

      datasets: [
        {
          data: dados.map((x) => x.quantidade),
        },
      ],
    },
  });
}
