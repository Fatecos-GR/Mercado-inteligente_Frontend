// ======================================
// IMPORTS
// ======================================

import { protegerRotaPerfil } from "../utils/authGuard.js";

import { entidades } from "../config/entidades_admin.js";

import { getEntityService } from "../services/adminEntityService.js";

import {
  abrirModalConfirmacao,
  abrirModalResultado,
} from "../utils/modalUtils.js";

import {
  configurarBuscaCEP,
  preencherEndereco,
  montarEndereco,
  removerCamposEndereco,
} from "../utils/enderecoUtils.js";

import {
  buscarMarcas,
  buscarCategorias,
  buscarFornecedores,
  buscarMarcasEQuantidade,
  buscarFornecedorEQuantidade,
  buscarCategoriasEQuantidade,
} from "../services/api.js";

import {
  aplicarMascaraMoeda,
  aplicarMascaraInteiro,
  formatarMoneyParaView,
  aplicarMascaraTelefone,
  formatarTelefone,
  formatarDataHoraParaInput,
} from "../utils/mascaras.js";

import {
  limparErros,
  mostrarErro,
  mostrarMensagemFormulario,
  limparMensagemFormulario,
  preencherSelects,
  configurarToggleSenha,
} from "../utils/formUtils.js";

import {
  configurarPreviewImagem,
  preencherPreviewImagem,
} from "../utils/imagePreview.js";

import {
  getTipoEntidade,
  getIdRegistro,
  estaEditando,
  getEntidadeAtual,
} from "../utils/formContext.js";

import { renderFormularioEntidadeAdmin } from "../render.js";

import {
  validarCep,
  validarEmail,
  validarTelefone,
  validarValidade,
  validarRequired,
  validarSenhaFuncionario,
} from "../utils/validators.js";

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

    // TELEFONE
    if (campo.name === "telefone") {
      aplicarMascaraTelefone(input);
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
  const camposSelect = entidade.camposFormulario.filter(
    (campo) => campo.type === "select",
  );

  for (const campo of camposSelect) {
    if (campo.entidadeRelacionada) {
      await popularSelect(campo);
      continue;
    }

    if (campo.opcoes) {
      const select = document.getElementById(campo.name);

      if (!select) continue;

      select.innerHTML = `
      <option value="">
        Selecione...
      </option>
    `;

      campo.opcoes.forEach((opcao) => {
        select.innerHTML += `
        <option value="${opcao.value}">
          ${opcao.label}
        </option>
      `;
      });
    }
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

    if (campo.readonly) return;

    if (campo.name === "confirmarSenha") {
      return;
    }

    if (campo.type === "file") {
      dados[campo.name] = elemento.files?.[0] || null;
      return;
    }

    // MONEY
    if (campo.type === "money") {
      dados[campo.name] = elemento.value.replace(",", ".");
      return;
    }

    // TELEFONE
    if (campo.name === "telefone") {
      dados[campo.name] = elemento.value.replace(/\D/g, "");
      return;
    }

    if (
      entidade.tipo === "funcionarios" &&
      estaEditando() &&
      campo.name === "senha" &&
      !elemento.value.trim()
    ) {
      return;
    }

    dados[campo.name] = elemento.value;
  });

  if (entidade.tipo === "fornecedores") {
    dados.endereco = montarEndereco(dados);

    removerCamposEndereco(dados);
  }

  if (entidade.tipo === "estoque") {
    return {
      produtoId: parseInt(getIdRegistro(), 10),
      quantidade: parseInt(dados.quantidade, 10),
      tipo: dados.tipoMovimentacao,
    };
  }

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

    if (campo.readonly) return;

    if (campo.type === "file") return;

    if (campo.name === "cep") {
      valido = validarCep(elemento) && valido;
    }

    if (campo.name === "email") {
      valido = validarEmail(elemento) && valido;
    }

    if (campo.name === "telefone") {
      valido = validarTelefone(elemento) && valido;
    }

    if (campo.name === "validade") {
      valido = validarValidade(elemento) && valido;
    }

    valido = validarRequired(campo, elemento) && valido;
  });

  if (entidade.tipo === "funcionarios") {
    valido = validarSenhaFuncionario() && valido;
  }

  return valido;
}

// ======================================
// TRATAMENTO DE ERROS
// ======================================

function tratarErroFormulario(erro) {
  console.error(erro);

  const email = document.getElementById("email");

  // Validações do backend
  if (erro.status === 400) {
    if (erro.erros?.length) {
      erro.erros.forEach((item) => {
        const campo = document.getElementById(item.campo);

        if (campo) {
          mostrarErro(campo, item.mensagem);
        }
      });

      return;
    }

    if (erro.erro === "Este endereço já está cadastrado no sistema.") {
      const numero = document.getElementById("numero");

      mostrarErro(numero, erro.erro);

      return;
    }
  }

  // E-mail já cadastrado
  if (erro.status === 409) {
    if (email) {
      mostrarErro(email, "Este e-mail já está em uso.");
    }

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

  if (entidade.tipo === "estoque") {
    return await service.salvar(dados);
  }

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
        ? `${entidade.singular} atualizado(a) com sucesso.`
        : `${entidade.singular} cadastrado(a) com sucesso.`;

      mostrarMensagemFormulario(mensagem, "success");

      await abrirModalResultado(mensagem);

      setTimeout(() => {
        window.location.href = entidade.rotaGestao;
      }, 300);
    } catch (erro) {
      tratarErroFormulario(erro);
    }
  });
}

// ======================================
// MÉTODO DE MODAL DE EXCLUSÃO
// ======================================
async function obterQuantidadeProdutosRelacionados(entidade) {
  if (!["marcas", "categorias", "fornecedores"].includes(entidade.tipo)) {
    return null;
  }

  const registro = await buscarRegistro(entidade, getIdRegistro());

  let dadosQuantidade = [];

  switch (entidade.tipo) {
    case "marcas":
      dadosQuantidade = await buscarMarcasEQuantidade();
      break;

    case "categorias":
      dadosQuantidade = await buscarCategoriasEQuantidade();
      break;

    case "fornecedores":
      dadosQuantidade = await buscarFornecedorEQuantidade();
      break;
  }

  const item = dadosQuantidade.find((x) => x.nome === registro.nome);

  return item?.quantidade ?? 0;
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
    let mensagem = "Deseja realmente excluir este registro?";

    const quantidadeProdutos =
      await obterQuantidadeProdutosRelacionados(entidade);

    if (quantidadeProdutos !== null) {
      mensagem = `
    Deseja realmente excluir este ${entidade.singular.toLowerCase()}?

    Existem ${quantidadeProdutos} produto(s)
    vinculados a este registro.
  `;
    }

    const confirmou = await abrirModalConfirmacao(mensagem);

    if (!confirmou) return;

    try {
      await excluirEntidadeFormulario(entidade, getIdRegistro());

      await abrirModalResultado(
        `${entidade.singular} excluído(a) com sucesso.`,
      );

      window.location.href = entidade.rotaGestao;
    } catch (erro) {
      console.error(erro);

      await abrirModalResultado("Erro ao excluir registro.");
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

  // 1. primeiro selects precisam existir
  await popularSelectsFormulario(entidade);

  // 2. depois preenche inputs normais
  preencherFormulario(entidade, registro);

  // 3. depois corrige selects com valor
  preencherSelects(entidade, registro);

  // 4. imagem
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

    if (campo.name === "telefone") {
      elemento.value = formatarTelefone(dados[campo.name]);

      return;
    }

    // MONEY (IMPORTANTE)
    if (campo.type === "money") {
      elemento.value = formatarMoneyParaView(dados[campo.name]);
      return;
    }

    if (entidade.tipo === "fornecedores") {
      document.getElementById("nome").value = dados.nome ?? "";

      preencherEndereco(dados.endereco);

      return;
    }

    // DATE DO ESTOQUE
    if (entidade.tipo === "estoque" && campo.type === "datetime-local") {
      elemento.value = formatarDataHoraParaInput(dados[campo.name]);

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

  if (!protegerRotaPerfil(["ADMIN", "ESTOQUISTA"])) return;

  if (entidade.tipo === "produtos" && !protegerRotaPerfil(["ADMIN"])) {
    return;
  }

  configurarPagina(entidade);

  const modoEdicao = estaEditando();

  renderFormularioEntidadeAdmin(entidade, modoEdicao);

  configurarToggleSenha();

  const validadeInput = document.getElementById("validade");

  if (validadeInput) {
    validadeInput.min = new Date().toISOString().split("T")[0];
  }

  await popularSelectsFormulario(entidade);

  aplicarMascarasFormulario(entidade);

  configurarPreviewImagem(entidade);

  await carregarDadosEdicao(entidade);

  configurarSubmit(entidade);

  configurarExclusaoFormulario(entidade);

  configurarBuscaCEP(modoEdicao);
}
