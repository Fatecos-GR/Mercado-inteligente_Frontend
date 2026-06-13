// ======================================
// IMPORTS
// ======================================

import { protegerRotaAdmin } from "../utils/authGuard.js";

import { entidades } from "../config/entidades_admin.js";

import { getEntityService } from "../services/adminEntityService.js";

import {
  configurarBuscaCEP,
  preencherEndereco,
} from "../utils/enderecoUtils.js";

import {
  buscarMarcas,
  buscarCategorias,
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

import {
  configurarPreviewImagem,
  preencherPreviewImagem,
} from "../utils/imagePreview.js";

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

// ======================================
// VALIDAÇÃO DO FORMULÁRIO
// ======================================

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

// ======================================
// TRATAMENTO DE ERROS
// ======================================

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

// ======================================
// SALVAR
// ======================================
async function salvarEntidade(entidade, dados) {
  const id = getIdRegistro();

  const service = getEntityService(entidade.tipo);

  return id ? await service.atualizar(id, dados) : await service.salvar(dados);
}

// ======================================
// CONFIGURAÇÃO DO ENVIO
// ======================================
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

      const mensagem = estaEditando()
        ? `${entidade.singular} atualizada com sucesso.`
        : `${entidade.singular} cadastrada com sucesso.`;

      mostrarMensagemFormulario(mensagem, "success");

      setTimeout(() => {
        window.location.href = entidade.rotaGestao;
      }, 300);
    } catch (erro) {
      tratarErroFormulario(erro);
    }
  });
}

// ======================================
// EXCLUIR
// ======================================
async function excluirEntidadeFormulario(entidade, id) {
  const service = getEntityService(entidade.tipo);

  return await service.excluir(id);
}

function configurarExclusaoFormulario(entidade) {
  const btn = document.getElementById("btn-excluir");

  if (!btn) return;

  btn.addEventListener("click", async () => {
    const confirmou = confirm("Deseja realmente excluir este registro?");

    if (!confirmou) return;

    try {
      await excluirEntidadeFormulario(entidade, getIdRegistro());

      window.location.href = entidade.rotaGestao;
    } catch (erro) {
      console.error(erro);

      mostrarMensagemFormulario("Erro ao excluir registro.");
    }
  });
}

// ======================================
// BUSCA DE REGISTRO E CARREGAMENTO DE DADOS PARA MODO DE EDIÇÃO
// ======================================
async function buscarRegistro(entidade, id) {
  const service = getEntityService(entidade.tipo);

  return await service.buscar(id);
}

async function carregarDadosEdicao(entidade) {
  const id = getIdRegistro();

  if (!id) return;

  const registro = await buscarRegistro(entidade, id);

  preencherFormulario(entidade, registro);

  preencherPreviewImagem(entidade, registro);
}

// ======================================
// PREENCHIMENTO DO FORMULÁRIO (QUANDO ESTÁ EDITANDO)
// ======================================
function preencherFormulario(entidade, dados) {
  entidade.camposFormulario.forEach((campo) => {
    const elemento = document.getElementById(campo.name);

    if (!elemento) return;

    if (campo.type === "file") {
      return;
    }

    if (entidade.tipo === "fornecedores") {
      document.getElementById("nome").value = dados.nome ?? "";

      preencherEndereco(dados.endereco);

      return;
    }

    elemento.value = dados[campo.name] ?? "";
  });
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

  configurarExclusaoFormulario(entidade);

  configurarBuscaCEP(modoEdicao);
}
