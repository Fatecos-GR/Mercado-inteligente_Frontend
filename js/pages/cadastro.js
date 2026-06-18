// ======================================
// IMPORTS
// ======================================

import { realizarCadastro } from "../services/api.js";

import { salvarToken } from "../utils/localStorageUtils.js";

import { aplicarMascaraTelefone } from "../utils/mascaras.js";

import {
  configurarToggleSenha,
  limparErros,
  mostrarErro,
  mostrarMensagemFormulario,
  limparMensagemFormulario,
} from "../utils/formUtils.js";

import { abrirModalResultado } from "../utils/modalUtils.js";

// ======================================
// LOGIN
// ======================================
async function fazerCadastro(nome, sobrenome, email, telefone, senha) {
  const resposta = await realizarCadastro(
    nome,
    sobrenome,
    email,
    telefone,
    senha,
  );

  salvarToken(resposta.token);

  return resposta;
}

// ======================================
// VALIDAÇÃO DE FORMULÁRIO
// ======================================

function validarFormulario() {
  limparErros();
  limparMensagemFormulario();

  const nome = document.getElementById("first-name");

  const sobrenome = document.getElementById("second-name");

  const email = document.getElementById("email");

  const telefone = document.getElementById("phone");

  const senha = document.getElementById("password");

  const confirmarSenha = document.getElementById("confirm-password");

  let valido = true;

  // NOME

  if (!nome.value.trim()) {
    mostrarErro(nome, "Informe seu nome.");

    valido = false;
  }

  // SOBRENOME

  if (!sobrenome.value.trim()) {
    mostrarErro(sobrenome, "Informe seu sobrenome.");

    valido = false;
  }

  // EMAIL

  if (!email.value.trim()) {
    mostrarErro(email, "Informe seu e-mail.");

    valido = false;
  }

  // TELEFONE

  if (!telefone.value.trim()) {
    mostrarErro(telefone, "Informe seu telefone.");

    valido = false;
  }

  const telefoneNumerico = telefone.value.replace(/\D/g, "");

  if (telefoneNumerico.length !== 11) {
    mostrarErro(telefone, "Informe um telefone válido.");

    valido = false;
  }

  // SENHA

  if (!senha.value.trim()) {
    mostrarErro(senha, "Informe sua senha.");

    valido = false;
  }

  // CONFIRMAR SENHA

  if (!confirmarSenha.value.trim()) {
    mostrarErro(confirmarSenha, "Confirme sua senha.");

    valido = false;
  }

  // SENHAS DIFERENTES

  if (
    senha.value.trim() &&
    confirmarSenha.value.trim() &&
    senha.value !== confirmarSenha.value
  ) {
    mostrarErro(confirmarSenha, "As senhas não coincidem.");

    valido = false;
  }

  return valido;
}

// ======================================
// TRATAMENTO DE ERROS
// ======================================
function tratarErroCadastro(erro) {
  const email = document.getElementById("email");

  const senha = document.getElementById("password");

  const telefone = document.getElementById("phone");

  if (erro.status === 400) {
    erro.erros?.forEach((item) => {
      switch (item.campo) {
        case "email":
          mostrarErro(email, item.mensagem);
          break;

        case "senha":
          mostrarErro(senha, item.mensagem);
          break;

        case "telefone":
          mostrarErro(telefone, item.mensagem);
          break;
      }
    });

    return;
  }

  if (erro.status === 409) {
    mostrarErro(email, "Este e-mail já está em uso.");
    return;
  }

  mostrarMensagemFormulario(erro.erro || "Erro ao realizar cadastro.");
}

// ======================================
// CONFIGURAÇÃO DO SUBMIT
// ======================================
function configurarSubmit() {
  const form = document.querySelector(".registration-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formularioValido = validarFormulario();

    if (!formularioValido) {
      return;
    }

    const nome = document.getElementById("first-name").value.trim();
    const sobrenome = document.getElementById("second-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("phone").value.replace(/\D/g, "");
    const senha = document.getElementById("password").value.trim();

    try {
      const resposta = await fazerCadastro(
        nome,
        sobrenome,
        email,
        telefone,
        senha,
      );

      await abrirModalResultado("Cadastro realizado com sucesso!");

      window.location.href = "index.html";
    } catch (erro) {
      console.log(erro);
      tratarErroCadastro(erro);
    }
  });
}

// ======================================
// START
// ======================================
export function iniciarCadastro() {
  configurarToggleSenha();

  const telefone = document.getElementById("phone");

  if (telefone) {
    aplicarMascaraTelefone(telefone);
  }

  configurarSubmit();
}
