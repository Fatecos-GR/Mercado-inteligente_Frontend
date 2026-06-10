// ======================================
// VISIBILIDADE DA SENHA
// ======================================

export function configurarToggleSenha() {
  const botao = document.querySelector(".btn-toggle-password");

  const input = document.getElementById("password");

  if (!botao || !input) return;

  botao.addEventListener("click", () => {
    const visivel = input.type === "text";

    input.type = visivel ? "password" : "text";

    botao.innerHTML = visivel
      ? '<i class="fas fa-eye"></i>'
      : '<i class="fas fa-eye-slash"></i>';
  });
}

// ======================================
// LIMPAR CAMPOS COM ERRO
// ======================================
export function limparErros() {
  document.querySelectorAll(".input-container").forEach((container) => {
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
  const container = input.closest(".input-container");

  container.classList.add("error");

  const erro = container.querySelector(".field-error");

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
