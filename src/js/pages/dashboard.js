import { protegerRotaPerfil } from "../utils/authGuard.js";

import {
  buscarEstatisticas,
  buscarMarcasEQuantidade,
  buscarFornecedorEQuantidade,
  buscarCategoriasEQuantidade,
  buscarQuantidadeProdutosBaixoEstoque,
  buscarQuantidadeTotalProdutosEstoque,
  buscarQuantidadeDeCadaProduto,
  buscarQuantidadeDeClientes,
  buscarQuantidadeProdutosProximoVencimento,
  buscarQuantidadeProdutosVencidos,
} from "../services/api.js";

export async function iniciarDashboard() {
  !protegerRotaPerfil(["ADMIN"]);
  try {
    const [
      estatisticas,
      marcas,
      fornecedores,
      categorias,
      baixoEstoque,
      estoqueTotal,
      produtos,
      totalClientes,
      proximoVencimento,
      vencidos,
    ] = await Promise.all([
      buscarEstatisticas(),
      buscarMarcasEQuantidade(),
      buscarFornecedorEQuantidade(),
      buscarCategoriasEQuantidade(),
      buscarQuantidadeProdutosBaixoEstoque(),
      buscarQuantidadeTotalProdutosEstoque(),
      buscarQuantidadeDeCadaProduto(),
      buscarQuantidadeDeClientes(),
      buscarQuantidadeProdutosProximoVencimento(),
      buscarQuantidadeProdutosVencidos(),
    ]);

    preencherCards(
      estatisticas,
      baixoEstoque,
      estoqueTotal,
      totalClientes,
      proximoVencimento,
      vencidos,
    );

    renderProdutos(produtos);

    renderGraficoCategorias(categorias);

    renderGraficoMarcas(marcas);

    renderGraficoFornecedores(fornecedores);
  } catch (erro) {
    console.error(erro);
  }
}

function preencherCards(
  estatisticas,
  baixoEstoque,
  estoqueTotal,
  totalClientes,
  proximoVencimento,
  vencidos,
) {
  document.getElementById("total-produtos").textContent =
    estatisticas.quantidadeProdutos;

  document.getElementById("baixo-estoque").textContent = baixoEstoque.length;

  document.getElementById("estoque-total").textContent = estoqueTotal;

  document.getElementById("total-clientes").textContent = totalClientes;

  document.getElementById("total-proximos-vencimento").textContent =
    proximoVencimento;

  document.getElementById("total-vencidos").textContent = vencidos;
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
