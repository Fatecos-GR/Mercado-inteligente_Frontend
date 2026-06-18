import {
  obterId,
  obterNome,
  obterSobrenome,
  obterEmail,
  obterTelefone,
  salvarNome,
  salvarSobrenome,
  salvarEmail,
  salvarTelefone,
} from "../utils/localStorageUtils.js";

import { validarEmail, validarTelefone } from "../utils/validators.js";

import { buscarUsuarioPorId, atualizarUsuario } from "../services/api.js";

import { formatarTelefone, aplicarMascaraTelefone } from "../utils/mascaras.js";

import {
  limparErros,
  limparMensagemFormulario,
  mostrarErro,
  mostrarMensagemFormulario,
  configurarToggleSenha,
} from "../utils/formUtils.js";

import { abrirModalResultado } from "../utils/modalUtils.js";

// ==========================
// INIT
// ==========================

export function iniciarPerfil() {
  iniciarMenuLateral();

  configurarMascaras();

  configurarToggleSenha();

  carregarDadosPerfil();

  iniciarEdicaoPerfil();
}

function carregarDadosPerfil() {
  const nomeInput = document.getElementById("perfil-nome");
  const sobrenomeInput = document.getElementById("perfil-sobrenome");
  const emailInput = document.getElementById("user-email");
  const telefoneInput = document.getElementById("perfil-telefone");

  if (nomeInput) {
    nomeInput.value = obterNome();
  }

  if (sobrenomeInput) {
    sobrenomeInput.value = obterSobrenome();
  }

  if (emailInput) {
    emailInput.value = obterEmail();
  }

  if (telefoneInput) {
    telefoneInput.value = formatarTelefone(obterTelefone());
  }
}

// ==========================
// MASCARES
// ==========================

function configurarMascaras() {
  const telefone = document.getElementById("perfil-telefone");
  if (telefone) aplicarMascaraTelefone(telefone);
}

// ==========================
// MENU LATERAL
// ==========================

function iniciarMenuLateral() {
  const navLinks = document.querySelectorAll(
    ".profile-nav a:not(.link-logout)",
  );

  const sections = document.querySelectorAll(".content-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      navLinks.forEach((n) => n.classList.remove("active"));
      sections.forEach((s) => (s.style.display = "none"));

      link.classList.add("active");

      const target = link.dataset.target;
      const section = document.getElementById(target);

      if (section) section.style.display = "block";
    });
  });
}

// ==========================
// EDITAR / SALVAR
// ==========================

function iniciarEdicaoPerfil() {
  const btn = document.querySelector(".btn-edit-profile");
  const inputs = document.querySelectorAll(".field-input");

  if (!btn) return;

  btn.addEventListener("click", async () => {
    const editing = btn.classList.contains("is-editing");

    if (!editing) {
      habilitarEdicao(inputs, btn);
    } else {
      await salvarDados(inputs, btn);
    }
  });
}

// ==========================
// HABILITAR EDIÇÃO
// ==========================

function habilitarEdicao(inputs, btn) {
  inputs.forEach((input) => {
    if (input.id !== "user-email") {
      input.disabled = false;
    }
  });

  btn.classList.add("is-editing");
  btn.textContent = "Salvar dados";
}

function validarFormulario() {
  limparErros();
  limparMensagemFormulario();

  const nome = document.getElementById("perfil-nome");
  const sobrenome = document.getElementById("perfil-sobrenome");
  const email = document.getElementById("user-email");
  const telefone = document.getElementById("perfil-telefone");

  let valido = true;

  if (!nome.value.trim()) {
    mostrarErro(nome, "Informe seu nome.");
    valido = false;
  }

  if (!sobrenome.value.trim()) {
    mostrarErro(sobrenome, "Informe seu sobrenome.");
    valido = false;
  }

  valido = validarEmail(email) && valido;
  valido = validarTelefone(telefone) && valido;

  return valido;
}

function obterDadosFormulario() {
  const dados = {
    nome: document.getElementById("perfil-nome").value.trim(),
    sobrenome: document.getElementById("perfil-sobrenome").value.trim(),
    email: document.getElementById("user-email").value.trim(),
    telefone: document
      .getElementById("perfil-telefone")
      .value.replace(/\D/g, ""),
  };

  const senha = document.getElementById("perfil-senha")?.value.trim();

  if (senha) {
    dados.senha = senha;
  }

  return dados;
}

function tratarErroFormulario(erro) {
  const email = document.getElementById("user-email");
  const telefone = document.getElementById("perfil-telefone");
  const senha = document.getElementById("perfil-senha");

  if (erro.status === 400) {
    erro.erros?.forEach((item) => {
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

  if (erro.status === 409) {
    mostrarErro(email, "Este e-mail já está em uso.");
    return;
  }

  mostrarMensagemFormulario(erro.erro || "Erro ao atualizar perfil.");
}

async function salvarDados(inputs, btnEdit) {
  if (!validarFormulario()) {
    return;
  }

  try {
    const id = obterId();

    const dados = obterDadosFormulario();

    await atualizarUsuario(id, dados);

    salvarNome(dados.nome);
    salvarSobrenome(dados.sobrenome);
    salvarEmail(dados.email);
    salvarTelefone(dados.telefone);

    inputs.forEach((input) => {
      input.disabled = true;
    });

    btnEdit.classList.remove("is-editing");
    btnEdit.textContent = "Editar dados";
    btnEdit.style.backgroundColor = "var(--verde-escuro)";

    mostrarMensagemFormulario("Perfil atualizado com sucesso!", "success");

    const senhaInput = document.getElementById("perfil-senha");

    if (senhaInput) {
      senhaInput.value = "";
    }
  } catch (erro) {
    tratarErroFormulario(erro);
  }
}
