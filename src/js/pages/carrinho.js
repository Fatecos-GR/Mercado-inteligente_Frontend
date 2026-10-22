import { atualizarCarrinhoHeader } from "../components/headerClient.js";

import {
  obterCarrinhoAtivo,
  adicionarItemCarrinho,
  removerItemCarrinho,
  atualizarItemCarrinho,
  buscarCep,
} from "../services/api.js";

import { obterEndereco } from "../utils/localStorageUtils.js";

import { aplicarMascaraCEP } from "../utils/mascaras.js";

// ======================================
// START CARRINHO
// ======================================

export async function iniciarCarrinho() {
  configurarCEP();
  await renderizarCarrinho();
}

function configurarCEP() {
  const cepInput = document.getElementById("cep-input");
  const btnCalcular = document.querySelector(".btn-calc");
  const mensagem = document.getElementById("shipping-message");

  if (!cepInput) return;

  aplicarMascaraCEP(cepInput);

  const enderecoSalvo = obterEndereco();

  if (enderecoSalvo?.cep) {
    cepInput.value = enderecoSalvo.cep;

    if (mensagem) {
      mensagem.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Entrega disponível para
        <strong>${enderecoSalvo.cidade}/${enderecoSalvo.estado}</strong>.
      `;
    }
  }

  btnCalcular?.addEventListener("click", async () => {
    try {
      const cep = cepInput.value.replace(/\D/g, "");

      const endereco = await buscarCep(cep);

      if (!endereco?.cidade || !endereco?.estado) {
        mensagem.innerHTML = `
          <i class="fas fa-times-circle"></i>
          CEP não encontrado.
        `;
        return;
      }

      mensagem.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Entrega disponível para
        <strong>${endereco.cidade}/${endereco.estado}</strong>.
      `;
    } catch {
      mensagem.innerHTML = `
        <i class="fas fa-times-circle"></i>
        CEP não encontrado.
      `;
    }
  });
}

function atualizarBotaoFinalizar(habilitado) {
  const btn = document.querySelector(".btn-finalize");

  if (!btn) return;

  if (habilitado) {
    btn.classList.remove("disabled");
    btn.style.pointerEvents = "auto";
    btn.style.opacity = "1";
  } else {
    btn.classList.add("disabled");
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.5";
  }
}

// ======================================
// RENDERIZAR CARRINHO
// ======================================

async function renderizarCarrinho() {
  const lista = document.getElementById("cart-items-list");
  const total = document.getElementById("total-carrinho");

  if (!lista || !total) return;

  try {
    const carrinho = await obterCarrinhoAtivo();

    if (!carrinho?.itens?.length) {
      lista.innerHTML = `
        <p class="cart-empty">
          Seu carrinho está vazio.
        </p>
      `;

      total.textContent = "R$ 0,00";

      atualizarBotaoFinalizar(false);

      atualizarCarrinhoHeader();

      return;
    }

    lista.innerHTML = carrinho.itens
      .map(
        (item) => `
          <article class="cart-item">

            <div class="product-info">
              <p class="product-name">
                ${item.produtoNome}
              </p>
            </div>

            <div class="quantity-controls">

              <button
                class="btn-diminuir"
                data-id="${item.produtoId}"
                data-qtd="${item.quantidade}"
              >
                -
              </button>

              <span>
                ${item.quantidade}
              </span>

              <button
                class="btn-aumentar"
                data-id="${item.produtoId}"
                data-qtd="${item.quantidade}"
              >
                +
              </button>

              <button
                class="btn-remover"
                data-id="${item.produtoId}"
              >
                <i class="fas fa-trash"></i>
              </button>

            </div>

            <div class="value-info">
              <strong>
                R$ ${item.subtotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>

          </article>
        `,
      )
      .join("");

    atualizarBotaoFinalizar(true);

    total.textContent = `R$ ${carrinho.valorTotal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    configurarEventosCarrinho();
  } catch (erro) {
    if (erro.status === 404) {
      lista.innerHTML = `
        <p class="cart-empty">
          Seu carrinho está vazio.
        </p>
      `;

      total.textContent = "R$ 0,00";

      atualizarBotaoFinalizar(false);

      atualizarCarrinhoHeader();

      return;
    }

    console.error("Erro ao carregar carrinho:", erro);
  }
}

// ======================================
// EVENTOS
// ======================================

function configurarEventosCarrinho() {
  document.querySelectorAll(".btn-aumentar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const produtoId = Number(btn.dataset.id);
      const quantidade = Number(btn.dataset.qtd) + 1;

      await alterarQuantidade(produtoId, quantidade);
    });
  });

  document.querySelectorAll(".btn-diminuir").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const produtoId = Number(btn.dataset.id);
      const quantidade = Number(btn.dataset.qtd) - 1;

      if (quantidade <= 0) {
        await removerItem(produtoId);
        return;
      }

      await alterarQuantidade(produtoId, quantidade);
    });
  });

  document.querySelectorAll(".btn-remover").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const produtoId = Number(btn.dataset.id);

      await removerItem(produtoId);
    });
  });
}

// ======================================
// REMOVER ITEM
// ======================================

async function removerItem(produtoId) {
  try {
    await removerItemCarrinho(produtoId);

    await renderizarCarrinho();
    atualizarCarrinhoHeader();
  } catch (erro) {
    console.error("Erro ao remover item:", erro);
  }
}

// ======================================
// ALTERAR QUANTIDADE
// ======================================

async function alterarQuantidade(produtoId, quantidade) {
  try {
    await atualizarItemCarrinho(produtoId, quantidade);

    await renderizarCarrinho();
    atualizarCarrinhoHeader();
  } catch (erro) {
    console.error("Erro ao atualizar quantidade:", erro);
  }
}

async function aumentarQuantidade(produtoId) {
  try {
    await adicionarItemCarrinho(produtoId, 1);

    await renderizarCarrinho();
    atualizarCarrinhoHeader();
  } catch (erro) {
    console.error(erro);
  }
}
