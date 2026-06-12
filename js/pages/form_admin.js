// ======================================
// IMPORTS
// ======================================

import { protegerRotaAdmin } from "../utils/authGuard.js";

import { entidades } from "../config/entidades_admin.js";

import {
  buscarMarcas,
  buscarMarcaPorId,
  salvarMarca,
  buscarCategorias,
  salvarCategoria,
  buscarFornecedores,
} from "../services/api.js";

import {
  aplicarMascaraMoeda,
  aplicarMascaraInteiro,
} from "../utils/mascaras.js";

import {
  limparErros,
  mostrarErro,
  mostrarMensagemFormulario,
  limparMensagemFormulario,
} from "../utils/formUtils.js";

import { renderFormularioEntidadeAdmin } from "../render.js";

// ======================================
// PEGAR TIPO
// ======================================

function getTipoEntidade() {
  const params = new URLSearchParams(window.location.search);

  return params.get("tipo");
}

// ======================================
// PEGAR ID E VER SE ESTÁ EM EDIÇÃO
// ======================================

function getIdRegistro() {
  const params = new URLSearchParams(window.location.search);

  return params.get("id");
}

function estaEditando() {
  return !!getIdRegistro();
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

  const modoEdicao = estaEditando();

  titulo.textContent = modoEdicao
    ? `Editar ${entidade.singular}`
    : `Cadastro de ${entidade.singular}`;

  // BOTÃO VOLTAR
  const voltar = document.getElementById("btn-voltar");

  voltar.href = entidade.rotaGestao;
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
// CONFIGURAÇÃO DA PREVIEW DE IMAGEM
// ======================================
function configurarPreviewImagem(entidade) {
  const camposImagem = entidade.camposFormulario.filter(
    (campo) => campo.type === "file",
  );

  camposImagem.forEach((campo) => {
    const input = document.getElementById(campo.name);

    const preview = document.getElementById(`${campo.name}-preview`);

    const texto = document.getElementById(`${campo.name}-text`);

    const btnRemover = document.getElementById(`${campo.name}-remove`);

    if (!input || !preview) return;

    input.addEventListener("change", () => {
      const arquivo = input.files?.[0];

      if (!arquivo) {
        preview.src = "";
        preview.style.display = "none";

        btnRemover.style.display = "none";

        texto.textContent = "Selecionar imagem";

        return;
      }

      texto.textContent = arquivo.name;

      const reader = new FileReader();

      reader.onload = (event) => {
        preview.src = event.target.result;

        preview.style.display = "block";

        btnRemover.style.display = "inline-flex";
      };

      reader.readAsDataURL(arquivo);
    });

    btnRemover.addEventListener("click", () => {
      input.value = "";

      preview.src = "";

      preview.style.display = "none";

      btnRemover.style.display = "none";

      texto.textContent = "Selecionar imagem";
    });
  });
}

// ======================================
// OBTER DADOS DO FORMULÁRIO
// ======================================
function obterDadosFormulario(entidade) {
  const dados = {};

  entidade.camposFormulario.forEach((campo) => {
    const elemento = document.getElementById(campo.name);

    if (!elemento) return;

    if (campo.type === "file") {
      dados[campo.name] = elemento.files?.[0] || null;
      return;
    }

    dados[campo.name] = elemento.value;
  });

  return dados;
}

function validarFormulario(entidade) {
  limparErros();

  let valido = true;

  entidade.camposFormulario.forEach((campo) => {
    const elemento = document.getElementById(campo.name);

    if (!elemento) return;

    // FILE
    if (campo.type === "file") {
      return;
    }

    // REQUIRED
    if (campo.required && !elemento.value.trim()) {
      mostrarErro(elemento, `${campo.label} é obrigatório.`);

      valido = false;
    }
  });

  return valido;
}

function tratarErroFormulario(erro) {
  console.error(erro);

  // Validação backend
  if (erro.status === 400) {
    erro.erros?.forEach((item) => {
      const campo = document.getElementById(item.campo);

      if (campo) {
        mostrarErro(campo, item.mensagem);
      }
    });

    return;
  }

  mostrarMensagemFormulario(erro.erro || "Erro ao salvar registro.");
}

async function salvarEntidade(entidade, dados) {
  switch (entidade.tipo) {
    case "marcas":
      return await salvarMarca(dados);

    case "categorias":
      return await salvarCategoria(dados);

    default:
      throw new Error(`Cadastro não implementado para ${entidade.tipo}`);
  }
}

function configurarSubmit(entidade) {
  const form = document.getElementById("admin-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    limparMensagemFormulario();

    const formularioValido = validarFormulario(entidade);

    if (!formularioValido) {
      return;
    }

    try {
      const dados = obterDadosFormulario(entidade);

      await salvarEntidade(entidade, dados);

      mostrarMensagemFormulario(
        `${entidade.singular} cadastrada com sucesso.`,
        "success",
      );

      setTimeout(() => {
        window.location.href = entidade.rotaGestao;
      }, 300);
    } catch (erro) {
      tratarErroFormulario(erro);
    }
  });
}

function preencherPreviewImagem(entidade, dados) {
  const campoImagem = entidade.camposFormulario.find(
    (campo) => campo.type === "file",
  );

  if (!campoImagem) return;

  const preview = document.getElementById(`${campoImagem.name}-preview`);

  if (!preview) return;

  if (!dados.imagem) return;

  preview.src = dados.imagem;

  preview.style.display = "block";
}

async function carregarDadosEdicao(entidade) {
  const id = getIdRegistro();

  if (!id) return;

  const registro = await buscarRegistro(entidade, id);

  preencherFormulario(entidade, registro);

  preencherPreviewImagem(entidade, registro);
}

function preencherFormulario(entidade, dados) {
  entidade.camposFormulario.forEach((campo) => {
    const elemento = document.getElementById(campo.name);

    if (!elemento) return;

    if (campo.type === "file") {
      return;
    }

    elemento.value = dados[campo.name] ?? "";
  });
}

async function buscarRegistro(entidade, id) {
  switch (entidade.tipo) {
    case "marcas":
      return await buscarMarcaPorId(id);

    default:
      throw new Error(`Busca não implementada para ${entidade.tipo}`);
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

  const modoEdicao = estaEditando();

  renderFormularioEntidadeAdmin(entidade, modoEdicao);

  await popularSelectsFormulario(entidade);

  aplicarMascarasFormulario(entidade);

  configurarPreviewImagem(entidade);

  await carregarDadosEdicao(entidade);

  configurarSubmit(entidade);
}
