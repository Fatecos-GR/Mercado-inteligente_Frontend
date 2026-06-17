// ======================================
// IMPORTS
// ======================================

import {
  obterPerfil,
  obterId,
  salvarNome,
} from "../utils/localStorageUtils.js";

import { aplicarMascaraTelefone, formatarTelefone } from "../utils/mascaras.js";

import { buscarFuncionarioPorId } from "../services/api.js";

import { validarEmail, validarTelefone } from "../utils/validators.js";

import { atualizarUsuario } from "../services/api.js";

// ======================================
// PERFIS
// ======================================

export function isAdmin() {
  return obterPerfil() === "ADMIN";
}

export function isEstoquista() {
  return obterPerfil() === "ESTOQUISTA";
}

// ======================================
// TABS
// ======================================

function configurarTabsPorPerfil(perfil) {
  const tabsPermitidas = {
    ADMIN: ["perfil"],
    ESTOQUISTA: ["perfil"],
  };

  const permitidas = tabsPermitidas[perfil] || [];

  document.querySelectorAll(".tab-btn").forEach((tab) => {
    const tipo = tab.dataset.tab;

    if (!permitidas.includes(tipo)) {
      tab.remove();
    }
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    const tipo = content.id.replace("tab-", "");

    if (!permitidas.includes(tipo)) {
      content.remove();
    }
  });

  if (permitidas.length) {
    const primeira = permitidas[0];

    document
      .querySelector(`.tab-btn[data-tab="${primeira}"]`)
      ?.classList.add("active");

    document.getElementById(`tab-${primeira}`)?.classList.add("active");
  }
}

function iniciarTabsConfiguracoes() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));

      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");

      document
        .getElementById(`tab-${tab.dataset.tab}`)
        ?.classList.add("active");
    });
  });
}

// ======================================
// PERFIL
// ======================================

async function carregarPerfil() {
  try {
    const id = obterId();

    if (!id) return;

    const funcionario = await buscarFuncionarioPorId(id);

    preencherPerfil(funcionario);
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
  }
}

function preencherPerfil(funcionario) {
  const nomeInput = document.getElementById("perfil-nome");
  const emailInput = document.getElementById("perfil-email");
  const telefoneInput = document.getElementById("perfil-telefone");
  const cargoInput = document.getElementById("perfil-cargo");

  if (nomeInput) {
    nomeInput.value =
      `${funcionario.nome} ${funcionario.sobrenome ?? ""}`.trim();
  }

  if (emailInput) {
    emailInput.value = funcionario.email ?? "";
  }

  if (telefoneInput) {
    telefoneInput.value = formatarTelefone(funcionario.telefone ?? "");
  }

  if (cargoInput) {
    cargoInput.value =
      funcionario.tipoFuncionario === "ADMIN" ? "Administrador" : "Estoquista";
  }
}

// ======================================
// MÁSCARAS
// ======================================

function configurarMascaras() {
  const telefoneInput = document.getElementById("perfil-telefone");

  if (telefoneInput) {
    aplicarMascaraTelefone(telefoneInput);
  }
}

// ======================================
// SUBMIT (PREPARAÇÃO)
// ======================================

function configurarSubmitPerfil() {
  const form = document.querySelector(".admin-main-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dados = {
      nome: document.getElementById("perfil-nome")?.value.trim(),

      email: document.getElementById("perfil-email")?.value.trim(),

      telefone: document
        .getElementById("perfil-telefone")
        ?.value.replace(/\D/g, ""),

      senha: document.getElementById("perfil-senha")?.value.trim(),
    };

    if (!dados.senha) {
      delete dados.senha;
    }

    console.log("DADOS PERFIL:", dados);

    // Próximo passo:
    // await atualizarFuncionario(obterId(), dados);
  });
}

function obterDadosFormulario() {
  return {
    nome: document.getElementById("perfil-nome").value.trim(),
    email: document.getElementById("perfil-email").value.trim(),
    telefone: document
      .getElementById("perfil-telefone")
      .value.replace(/\D/g, ""),
    senha: document.getElementById("perfil-senha").value.trim(),
  };
}

function validarFormulario() {
  limparErros();
  limparMensagemFormulario();

  const nome = document.getElementById("perfil-nome");
  const email = document.getElementById("perfil-email");
  const telefone = document.getElementById("perfil-telefone");

  let valido = true;

  if (!nome.value.trim()) {
    mostrarErro(nome, "Informe seu nome.");
    valido = false;
  }

  valido = validarEmail(email) && valido;
  valido = validarTelefone(telefone) && valido;

  return valido;
}

async function salvarPerfil() {
  const id = obterId();

  const dados = obterDadosFormulario();

  if (!dados.senha) {
    delete dados.senha;
  }

  return await atualizarUsuario(id, dados);
}

function tratarErroFormulario(erro) {
  console.error(erro);

  const email = document.getElementById("perfil-email");
  const telefone = document.getElementById("perfil-telefone");
  const senha = document.getElementById("perfil-senha");

  if (erro.status === 400) {
    if (erro.erros?.length) {
      erro.erros.forEach((item) => {
        switch (item.campo) {
          case "email":
            mostrarErro(email, item.mensagem);
            break;

          case "telefone":
            mostrarErro(telefone, item.mensagem);
            break;

          case "senha":
            mostrarErro(senha, item.mensagem);
            break;
        }
      });

      return;
    }
  }

  if (erro.status === 409) {
    mostrarErro(email, "Este e-mail já está em uso.");
    return;
  }

  mostrarMensagemFormulario(erro.erro || "Erro ao atualizar perfil.");
}

function configurarSubmit() {
  const form = document.querySelector(".admin-main-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formularioValido = validarFormulario();

    if (!formularioValido) {
      return;
    }

    try {
      await salvarPerfil();

      salvarNome(document.getElementById("perfil-nome").value.trim());

      await abrirModalResultado("Perfil atualizado com sucesso.");

      await carregarPerfil();
    } catch (erro) {
      tratarErroFormulario(erro);
    }
  });
}

// ======================================
// START
// ======================================

export async function iniciarConfiguracoes() {
  const perfil = obterPerfil();

  configurarTabsPorPerfil(perfil);

  iniciarTabsConfiguracoes();

  configurarMascaras();

  await carregarPerfil();

  configurarSubmitPerfil();
}
