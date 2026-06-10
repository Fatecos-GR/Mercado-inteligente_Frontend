// ======================================
// IMPORTS
// ======================================

import { protegerRotaAdmin } from "../utils/authGuard.js";

import { entidades } from "../config/entidades_admin.js";

import {
  buscarMarcas,
  buscarCategorias,
  buscarFornecedores,
} from "../services/api.js";

import {
  aplicarMascaraMoeda,
  aplicarMascaraInteiro,
} from "../utils/mascaras.js";

// ======================================
// PEGAR TIPO
// ======================================

function getTipoEntidade() {
  const params = new URLSearchParams(window.location.search);

  return params.get("tipo");
}

// ======================================
// ENTIDADE ATUAL
// ======================================

function getEntidadeAtual() {
  const tipo = getTipoEntidade();

  return entidades[tipo];
}

// ======================================
// CONFIGURAR PÁGINA
// ======================================

function configurarPagina(entidade) {
  // TÍTULO ABA
  document.title = `${entidade.singular} | Admin Melior`;

  // TÍTULO HEADER
  const titulo = document.getElementById("formulario-titulo");

  titulo.textContent = `Cadastro de ${entidade.singular}`;

  // BOTÃO VOLTAR
  const voltar = document.getElementById("btn-voltar");

  voltar.href = entidade.rotaGestao;
}

// ======================================
// RENDER INPUT
// ======================================

function renderInput(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <input
        type="${campo.type}"
        id="${campo.name}"
        name="${campo.name}"
        ${campo.required ? "required" : ""}
      />

    </div>
  `;
}

// ======================================
// RENDER TEXTAREA
// ======================================

function renderTextarea(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <textarea
        id="${campo.name}"
        name="${campo.name}"
        rows="4"
        ${campo.required ? "required" : ""}
      ></textarea>

    </div>
  `;
}

// ======================================
// RENDER SELECT
// ======================================

function renderSelect(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <select
        id="${campo.name}"
        name="${campo.name}"
        ${campo.required ? "required" : ""}
      >

        <option value="">
          Selecione...
        </option>

      </select>

    </div>
  `;
}

// ======================================
// RENDER CAMPO
// ======================================

function renderCampo(campo) {
  // TEXTAREA
  if (campo.type === "textarea") {
    return renderTextarea(campo);
  }

  // SELECT
  if (campo.type === "select") {
    return renderSelect(campo);
  }

  // INPUT PADRÃO
  return renderInput(campo);
}

// ======================================
// RENDER FORMULÁRIO
// ======================================

function renderFormulario(entidade) {
  const form = document.getElementById("admin-form");

  const camposHTML = entidade.camposFormulario.map(renderCampo).join("");

  form.innerHTML = `
    ${camposHTML}

    <div class="admin-form-actions">

      <button
        type="submit"
        class="admin-btn-submit"
      >

        Salvar ${entidade.singular} 

      </button>

    </div>
  `;
}

// ======================================
// APLICAR MÁSCARAS
// ======================================

function aplicarMascarasFormulario(entidade) {
  entidade.camposFormulario.forEach((campo) => {
    const input = document.getElementById(campo.name);

    if (!input) return;

    // MOEDA
    if (campo.type === "money") {
      aplicarMascaraMoeda(input);
    }

    // INTEIRO
    if (campo.type === "integer") {
      aplicarMascaraInteiro(input);
    }
  });
}

// ======================================
// POPULAR SELECTS
// ======================================
async function buscarDadosRelacionados(tipo) {
  switch (tipo) {
    case "marcas":
      return await buscarMarcas();

    case "categorias":
      return await buscarCategorias();

    case "fornecedores":
      return await buscarFornecedores();

    default:
      return [];
  }
}

async function popularSelect(campo) {
  const select = document.getElementById(campo.name);

  if (!select) return;

  const dados = await buscarDadosRelacionados(campo.entidadeRelacionada);

  select.innerHTML = `
    <option value="">
      Selecione...
    </option>
  `;

  dados.forEach((item) => {
    select.innerHTML += `
      <option value="${item.id}">
        ${item.nome}
      </option>
    `;
  });
}

async function popularSelectsFormulario(entidade) {
  const camposRelacionados = entidade.camposFormulario.filter(
    (campo) => campo.type === "select" && campo.entidadeRelacionada,
  );

  for (const campo of camposRelacionados) {
    await popularSelect(campo);
  }
}

// ======================================
// START
// ======================================

export async function iniciarFormularioAdmin() {
  const entidade = getEntidadeAtual();

  if (!entidade) return;

  if (!protegerRotaAdmin()) return;

  configurarPagina(entidade);

  renderFormulario(entidade);

  await popularSelectsFormulario(entidade);

  aplicarMascarasFormulario(entidade);
}
