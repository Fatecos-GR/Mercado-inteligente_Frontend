// ======================================
// VISIBILIDADE DA SENHA
// ======================================

export function configurarToggleSenha() {
  const botoes = document.querySelectorAll(".btn-toggle-password");

  const inputs = document.querySelectorAll('input[type="password"]');

  if (!botoes.length || !inputs.length) return;

  botoes.forEach((botao, index) => {
    const input = inputs[index];

    if (!input) return;

    botao.addEventListener("click", () => {
      const visivel = input.type === "text";

      input.type = visivel ? "password" : "text";

      botao.innerHTML = visivel
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  });
}

// ======================================
// LIMPAR CAMPOS COM ERRO
// ======================================
export function limparErros() {
  document
    .querySelectorAll(".input-container, .admin-form-group, .data-field")
    .forEach((container) => {
      container.classList.remove("error");

      const mensagem = container.querySelector(".field-error");

      if (mensagem) {
        mensagem.textContent = "";
      }
    });
}

// ======================================
// MOSTRAM CAMPOS DE ERRO
// ======================================
export function mostrarErro(input, mensagem) {
  const container =
    input.closest(".input-container") ||
    input.closest(".admin-form-group") ||
    input.closest(".data-field");

  if (!container) return;

  container.classList.add("error");

  let erro = container.querySelector(".field-error");

  if (!erro) {
    erro = document.createElement("span");

    erro.className = "field-error";

    container.appendChild(erro);
  }

  erro.textContent = mensagem;
}

// ======================================
// MOSTRAM MENSAGEM DO FORMULÁRIO
// ======================================
export function mostrarMensagemFormulario(mensagem, tipo = "error") {
  const elemento = document.querySelector(".form-message");

  if (!elemento) return;

  elemento.textContent = mensagem;

  elemento.classList.remove("error", "success");

  elemento.classList.add("show", tipo);
}

// ======================================
// MOSTRAM MENSAGEM DO FORMULÁRIO
// ======================================
export function limparMensagemFormulario() {
  const elemento = document.querySelector(".form-message");

  if (!elemento) return;

  elemento.textContent = "";

  elemento.classList.remove("show", "error", "success");
}

export function preencherSelects(entidade, dados) {
  const selects = entidade.camposFormulario.filter(
    (campo) => campo.type === "select",
  );

  selects.forEach((campo) => {
    const select = document.getElementById(campo.name);

    if (!select) return;

    const valor = dados[campo.name];

    if (!valor) return;

    select.value = String(valor);

    select.dispatchEvent(new Event("change"));
  });
}
