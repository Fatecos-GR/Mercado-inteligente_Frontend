// ======================================
// IMPORTS
// ======================================

import { realizarLogin } from "../services/api.js";

import {
  salvarToken,
  salvarPerfil,
  salvarNome,
  salvarId,
} from "../utils/localStorageUtils.js";

import { tiposLogin } from "../config/authConfig.js";

import {
  configurarToggleSenha,
  limparErros,
  mostrarErro,
  mostrarMensagemFormulario,
  limparMensagemFormulario,
} from "../utils/formUtils.js";

// ======================================
// CONFIGURAÇÃO DE LOGIN
// ======================================

function getTipoLogin() {
  const params = new URLSearchParams(window.location.search);

  return params.get("tipo") || "cliente";
}

function getConfiguracaoLogin() {
  const tipo = getTipoLogin();

  return tiposLogin[tipo];
}

// ======================================
// CONFIGURAR PÁGINA
// ======================================
function configurarPagina(config) {
  document.title = config.tituloPagina;

  document.querySelector(".form-title").textContent = config.tituloFormulario;

  document.querySelector(".info-title").textContent = config.tituloInfo;

  document.querySelector(".info-description").textContent = config.descricao;
}

function configurarLayout(config) {
  const header = document.getElementById("main-header");

  const footer = document.getElementById("main-footer");

  if (!config.mostrarFooter) {
    footer.remove();
  }
}

function configurarCadastro(config) {
  const botao = document.getElementById("btn-cadastro");

  if (!config.mostrarCadastro) {
    botao.remove();
  }
}

// ======================================
// VALIDAÇÃO DE FORMULÁRIO
// ======================================
function validarFormulario() {
  limparErros();
  limparMensagemFormulario();

  const email = document.getElementById("email");

  const senha = document.getElementById("password");

  let valido = true;

  // EMAIL

  if (!email.value.trim()) {
    mostrarErro(email, "Informe seu e-mail.");

    valido = false;
  }

  // SENHA

  if (!senha.value.trim()) {
    mostrarErro(senha, "Informe sua senha.");

    valido = false;
  }

  return valido;
}

// ======================================
// LOGIN
// ======================================
async function fazerLogin(email, senha) {
  const resposta = await realizarLogin(email, senha);

  salvarToken(resposta.token);

  salvarPerfil(resposta.usuario.perfil?.toUpperCase());

  salvarNome(resposta.usuario.nome);

  salvarId(resposta.usuario.id);

  return resposta;
}

// ======================================
// TRATAMENTO DE ERROS
// ======================================

function tratarErroLogin(erro) {
  const email = document.getElementById("email");

  const senha = document.getElementById("password");

  // ERRO DE VALIDAÇÃO
  if (erro.status === 400) {
    erro.erros?.forEach((item) => {
      if (item.campo === "email") {
        mostrarErro(email, item.mensagem);
      }

      if (item.campo === "senha") {
        mostrarErro(senha, item.mensagem);
      }
    });

    return;
  }

  // LOGIN INVÁLIDO
  if (erro.status === 401) {
    mostrarErro(email, erro.erro);
    mostrarErro(senha, erro.erro);

    return;
  }
}

// ======================================
// SUBMIT
// ======================================

function configurarSubmit(config) {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formularioValido = validarFormulario();

    if (!formularioValido) {
      return;
    }

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("password").value.trim();

    try {
      const resposta = await fazerLogin(email, senha);

      console.log("TOKEN:", resposta.token);

      window.location.href = config.rotaSucesso;

      setTimeout(() => {}, 1500);
    } catch (erro) {
      tratarErroLogin(erro);
    }
  });
}

// ======================================
// START
// ======================================

export function iniciarLogin() {
  const config = getConfiguracaoLogin();

  configurarToggleSenha();

  configurarSubmit(config);

  configurarPagina(config);

  configurarLayout(config);

  configurarCadastro(config);
}
