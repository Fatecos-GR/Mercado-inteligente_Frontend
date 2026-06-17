// ======================================
// IMPORTS
// ======================================

import { estaEditando } from "../utils/formContext.js";
import { camposEndereco } from "./camposEndereco.js";

// ======================================
// CONFIGURAÇÃO DAS ENTIDADES DO SISTEMA
// ======================================

export const entidades = {
  // ======================================
  // ESTOQUE
  // ======================================
  estoque: {
    tipo: "estoque",

    perfisPermitidos: ["ADMIN", "ESTOQUISTA"],

    singular: "Estoque",

    titulo: "Movimentação de Estoque",

    rotaGestao: "gestao.html?tipo=produtos",

    rotaFormulario: "/form_admin.html?tipo=estoque",

    camposFormulario: [
      {
        name: "produtoNome",
        label: "Nome do Produto",
        type: "text",
        required: true,
        readonly: true,
        disabled: true,
      },

      {
        name: "quantidadeDisponivel",
        label: "Quantidade Disponível",
        type: "integer",
        required: true,
        readonly: true,
        disabled: true,
      },

      {
        name: "quantidadeReservada",
        label: "Quantidade Reservada",
        type: "integer",
        required: true,
        readonly: true,
        disabled: true,
      },

      {
        name: "atualizadoEm",
        label: "Ultima atualização",
        type: "datetime-local",
        required: true,
        readonly: true,
        disabled: true,
      },

      {
        name: "quantidade",
        label: "Quantidade",
        type: "integer",
        required: true,
      },

      {
        name: "tipoMovimentacao",
        label: "Tipo da Movimentação",
        type: "select",
        required: true,

        opcoes: [
          {
            value: "ENTRADA",
            label: "Entrada",
          },
          {
            value: "SAIDA",
            label: "Saída",
          },
        ],
      },
    ],
  },

  // ======================================
  // PRODUTOS
  // ======================================
  produtos: {
    // ======================================
    // INFORMAÇÕES GERAIS
    // ======================================

    tipo: "produtos",

    perfisPermitidos: ["ADMIN", "ESTOQUISTA"],

    titulo: "Produtos",

    subtitulo: "Gerencie os produtos cadastrados no sistema.",

    singular: "Produto",

    plural: "Produtos",

    // ======================================
    // ROTAS
    // ======================================

    rotaGestao: "/gestao.html?tipo=produtos",

    rotaFormulario: "/form_admin.html?tipo=produtos",

    // ======================================
    // API
    // ======================================

    endpoint: "/produtos",

    // ======================================
    // UI
    // ======================================

    placeholderBusca: "Buscar produto...",

    textoBotaoAdicionar: "Novo Produto",

    icone: "fa-solid fa-box",

    // ======================================
    // LISTAGEM
    // ======================================

    cardLayout: "produto",

    camposListagem: ["nome", "categoriaNome", "marcaNome", "preco"],

    // ======================================
    // FORMULÁRIO
    // ======================================

    camposFormulario: [
      {
        name: "nome",
        label: "Nome do Produto",
        type: "text",
        required: true,
      },

      {
        name: "descricao",
        label: "Descrição",
        type: "textarea",
        required: true,
      },

      {
        name: "preco",
        label: "Preço em R$",
        type: "money",
        required: true,
      },

      {
        name: "validade",
        label: "Validade",
        type: "date",
        required: true,
      },

      {
        name: "imagem",
        label: "Imagem",
        type: "file",
        required: false,
      },

      {
        name: "marcaId",
        label: "Marca",
        type: "select",
        required: true,
        entidadeRelacionada: "marcas",
      },

      {
        name: "categoriaId",
        label: "Categoria",
        type: "select",
        required: true,

        entidadeRelacionada: "categorias",
      },

      {
        name: "fornecedorId",
        label: "Fornecedor",
        type: "select",
        required: true,

        entidadeRelacionada: "fornecedores",
      },
    ],
  },

  // ======================================
  // MARCAS
  // ======================================

  marcas: {
    tipo: "marcas",

    perfisPermitidos: ["ADMIN", "ESTOQUISTA"],

    titulo: "Marcas",

    subtitulo: "Gerencie as marcas cadastradas.",

    singular: "Marca",

    plural: "Marcas",

    rotaGestao: "/gestao.html?tipo=marcas",

    rotaFormulario: "/form_admin.html?tipo=marcas",

    endpoint: "/marcas",

    placeholderBusca: "Buscar marca...",

    textoBotaoAdicionar: "Nova Marca",

    icone: "fa-solid fa-tags",

    cardLayout: "simples",

    camposListagem: ["nome"],

    camposFormulario: [
      {
        name: "nome",
        label: "Nome da Marca",
        type: "text",
        required: true,
      },

      {
        name: "descricao",
        label: "Descrição",
        type: "textarea",
        required: true,
      },
      {
        name: "imagem",
        label: "Imagem",
        type: "file",
        required: false,
      },
    ],
  },

  // ======================================
  // CATEGORIAS
  // ======================================

  categorias: {
    tipo: "categorias",

    perfisPermitidos: ["ADMIN", "ESTOQUISTA"],

    titulo: "Categorias",

    subtitulo: "Gerencie as categorias cadastradas.",

    singular: "Categoria",

    plural: "Categorias",

    rotaGestao: "/gestao.html?tipo=categorias",

    rotaFormulario: "/form_admin.html?tipo=categorias",

    endpoint: "/categorias",

    placeholderBusca: "Buscar categoria...",

    textoBotaoAdicionar: "Nova Categoria",

    icone: "fa-solid fa-layer-group",

    cardLayout: "simples",

    camposListagem: ["nome"],

    camposFormulario: [
      {
        name: "nome",
        label: "Nome da Categoria",
        type: "text",
        required: true,
      },

      {
        name: "descricao",
        label: "Descrição",
        type: "textarea",
        required: true,
      },
      {
        name: "imagem",
        label: "Imagem",
        type: "file",
        required: false,
      },
    ],
  },

  // ======================================
  // FORNECEDORES
  // ======================================

  fornecedores: {
    tipo: "fornecedores",

    perfisPermitidos: ["ADMIN", "ESTOQUISTA"],

    titulo: "Fornecedores",

    subtitulo: "Gerencie os fornecedores cadastrados.",

    singular: "Fornecedor",

    plural: "Fornecedores",

    rotaGestao: "/gestao.html?tipo=fornecedores",

    rotaFormulario: "/form_admin.html?tipo=fornecedores",

    endpoint: "/fornecedores",

    placeholderBusca: "Buscar fornecedor...",

    textoBotaoAdicionar: "Novo Fornecedor",

    icone: "fa-solid fa-truck-field",

    cardLayout: "fornecedor",

    camposListagem: ["nome", "telefone", "email"],

    camposFormulario: [
      {
        name: "nome",
        label: "Nome",
        type: "text",
        required: true,
      },

      {
        name: "imagem",
        label: "Imagem",
        type: "file",
      },

      {
        type: "section",
        title: "Endereço",
      },

      ...camposEndereco,
    ],
  },

  // ======================================
  // FUNCIONÁRIOS
  // ======================================

  funcionarios: {
    tipo: "funcionarios",

    perfisPermitidos: ["ADMIN"],

    titulo: "Funcionários",

    subtitulo: "Gerencie os colaboradores cadastrados.",

    singular: "Funcionário",

    plural: "Funcionários",

    rotaGestao: "/gestao.html?tipo=funcionarios",

    rotaFormulario: "/form_admin.html?tipo=funcionarios",

    endpoint: "/funcionarios",

    placeholderBusca: "Buscar funcionário...",

    textoBotaoAdicionar: "Novo Funcionário",

    icone: "fa-solid fa-users",

    cardLayout: "funcionario",

    camposListagem: ["nome", "sobrenome", "email", "tipoFuncionario"],

    camposFormulario: [
      {
        name: "nome",
        label: "Nome",
        type: "text",
        required: true,
      },

      {
        name: "sobrenome",
        label: "Sobrenome",
        type: "text",
        required: true,
      },

      {
        name: "telefone",
        label: "Telefone",
        type: "text",
        required: true,
      },

      {
        name: "email",
        label: "E-mail",
        type: "email",
        required: true,
      },

      {
        name: "senha",
        label: "Senha",
        type: "password",
        required: !estaEditando(),
      },

      {
        name: "confirmarSenha",
        label: "Confirmar Senha",
        type: "password",
        required: !estaEditando(),
      },

      {
        name: "tipoFuncionario",
        label: "Cargo",
        type: "select",
        required: true,
        opcoes: [
          {
            value: "ADMIN",
            label: "Administrador",
          },
          {
            value: "ESTOQUISTA",
            label: "Estoquista",
          },
        ],
      },

      {
        name: "imagem",
        label: "Imagem",
        type: "file",
        required: false,
      },
    ],
  },

  // ======================================
  // USUÁRIOS
  // ======================================
  usuarios: {
    tipo: "usuarios",

    perfisPermitidos: ["ADMIN"],

    titulo: "Clientes",

    subtitulo: "Gerencie os clientes cadastrados no sistema.",

    singular: "Cliente",

    plural: "Clientes",

    rotaGestao: "/gestao.html?tipo=usuarios",

    endpoint: "/usuarios",

    placeholderBusca: "Buscar cliente...",

    permiteCadastro: false,

    icone: "fa-solid fa-user-group",

    cardLayout: "usuario",

    camposListagem: ["nome", "sobrenome", "email", "telefone"],
  },
};
