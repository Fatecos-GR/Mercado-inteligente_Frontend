// ======================================
// IMPORTS
// ======================================

import { modais } from "../config/modaisConfig.js";
import { renderModal } from "../render.js";

export function abrirModalConfirmacao(mensagem) {
  return new Promise((resolve) => {
    const container = document.createElement("div");

    container.innerHTML = renderModal(modais.confirmacao, mensagem);

    document.body.appendChild(container);

    const btnConfirmar = container.querySelector("#modal-btn-confirmar");

    const btnCancelar = container.querySelector("#modal-btn-cancelar");

    btnConfirmar.addEventListener("click", () => {
      container.remove();
      resolve(true);
    });

    btnCancelar.addEventListener("click", () => {
      container.remove();
      resolve(false);
    });
  });
}

export function abrirModalResultado(mensagem) {
  return new Promise((resolve) => {
    const container = document.createElement("div");

    container.innerHTML = renderModal(modais.resultado, mensagem);

    document.body.appendChild(container);

    const btnConfirmar = container.querySelector("#modal-btn-confirmar");

    btnConfirmar.addEventListener("click", () => {
      container.remove();
      resolve();
    });
  });
}
