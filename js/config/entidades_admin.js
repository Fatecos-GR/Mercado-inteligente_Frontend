// ======================================
// CONFIGURAÇÃO DAS ENTIDADES DO SISTEMA
// ======================================

export const entidades = {
  produtos: {
    // ======================================
    // INFORMAÇÕES GERAIS
    // ======================================

    tipo: "produtos",

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

    camposListagem: [
      "nome",
      "categoriaNome",
      "marcaNome",
      "preco",
      "estoqueDisponivel",
    ],

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
        label: "Preço",
        type: "number",
        required: true,
      },

      {
        name: "estoqueDisponivel",
        label: "Quantidade em Estoque",
        type: "number",
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
    ],
  },

  // ======================================
  // CATEGORIAS
  // ======================================

  categorias: {
    tipo: "categorias",

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
    ],
  },

  // ======================================
  // FORNECEDORES
  // ======================================

  fornecedores: {
    tipo: "fornecedores",

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
        label: "Nome do Fornecedor",
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
    ],
  },
};
