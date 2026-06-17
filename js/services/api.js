// ===============================
// CONFIGURAÇÃO DA API --> Arquivo que realiza as chamadas
// ===============================

const BASE_URL = "http://localhost:8080/api";

// ===============================
// FUNÇÃO DE REQUISIÇÃO
// ===============================
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const config = {
    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...(options.headers || {}),
    },

    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // tratamento básico de erro
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw (
      errorData || {
        status: response.status,
        erro: "Erro inesperado",
      }
    );
  }

  // caso não tenha conteúdo (204)
  if (response.status === 204) return null;

  return response.json();
}

// ===============================
// FUNÇÃO AUXILIAR DE MULTIPART(FORMDATA)
// ===============================
function criarMultipart(dados, nomeParte) {
  const formData = new FormData();

  const payload = { ...dados };

  const imagem = payload.imagem;

  delete payload.imagem;

  formData.append(nomeParte, JSON.stringify(payload));

  if (imagem) {
    formData.append("imagem", imagem);
  }

  return formData;
}

// ===============================
// AUTENTICAÇÃO
// ===============================
export async function realizarLogin(email, senha) {
  return request("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      senha,
    }),
  });
}

export async function realizarCadastro(
  nome,
  sobrenome,
  email,
  telefone,
  senha,
) {
  return request("/auth/register", {
    method: "POST",

    body: JSON.stringify({
      nome,
      sobrenome,
      email,
      telefone,
      senha,
    }),
  });
}

// ===============================
// CRUD ESTOQUE
// ===============================

export async function buscarEstoques() {
  return request(`/estoques`);
}

export async function buscarEstoquePorIdProduto(id) {
  return request(`/estoques/produto/${id}`);
}

// api.js (adicionar correto)
export async function ajustarEstoque(dados) {
  return request("/estoques/ajustes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// ===============================
// CRUD PRODUTOS
// ===============================

export async function salvarProduto(dados) {
  return request("/produtos", {
    method: "POST",
    body: criarMultipart(dados, "produto"),
  });
}

export async function buscarProdutos() {
  return request(`/produtos`);
}

export async function buscarProdutosPorNome(nome) {
  return request(`/produtos/search?nome=${nome}`);
}

export async function buscarProdutoPorId(id) {
  return request(`/produtos/${id}`);
}

export async function atualizarProduto(id, dados) {
  return request(`/produtos/${id}`, {
    method: "PUT",
    body: criarMultipart(dados, "produto"),
  });
}

export async function excluirProduto(id) {
  return request(`/produtos/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// CRUD MARCAS
// ===============================

export async function salvarMarca(dados) {
  return request("/marcas", {
    method: "POST",
    body: criarMultipart(dados, "marca"),
  });
}

export async function buscarMarcas() {
  return request(`/marcas`);
}

export async function buscarMarcasPorNome(nome) {
  return request(`/marcas/search?nome=${nome}`);
}

export async function buscarMarcaPorId(id) {
  return request(`/marcas/${id}`);
}

export async function atualizarMarca(id, dados) {
  return request(`/marcas/${id}`, {
    method: "PUT",
    body: criarMultipart(dados, "marca"),
  });
}

export async function excluirMarca(id) {
  return request(`/marcas/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// CRUD CATEGORIAS
// ===============================

export async function salvarCategoria(dados) {
  return request("/categorias", {
    method: "POST",
    body: criarMultipart(dados, "categoria"),
  });
}

export async function buscarCategorias() {
  return request(`/categorias`);
}

export async function buscarCategoriasPorNome(nome) {
  return request(`/categorias/search?nome=${nome}`);
}

export async function buscarCategoriaPorId(id) {
  return request(`/categorias/${id}`);
}

export async function atualizarCategoria(id, dados) {
  return request(`/categorias/${id}`, {
    method: "PUT",
    body: criarMultipart(dados, "categoria"),
  });
}

export async function excluirCategoria(id) {
  return request(`/categorias/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// CRUD FORNECEDORES
// ===============================

export async function salvarFornecedor(dados) {
  return request("/fornecedores", {
    method: "POST",
    body: criarMultipart(dados, "fornecedor"),
  });
}

export async function buscarFornecedores() {
  return request(`/fornecedores`);
}

export async function buscarFornecedoresPorNome(nome) {
  return request(`/fornecedores/search?nome=${nome}`);
}

export async function buscarFornecedorPorId(id) {
  return request(`/fornecedores/${id}`);
}

export async function atualizarFornecedor(id, dados) {
  return request(`/fornecedores/${id}`, {
    method: "PUT",
    body: criarMultipart(dados, "fornecedor"),
  });
}

export async function excluirFornecedor(id) {
  return request(`/fornecedores/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// CRUD FUNCIONARIOS
// ===============================

export async function salvarFuncionario(dados) {
  return request("/funcionarios", {
    method: "POST",
    body: criarMultipart(dados, "funcionario"),
  });
}

export async function buscarFuncionarios() {
  return request(`/funcionarios`);
}

export async function buscarFuncionariosPorNome(nome) {
  return request(`/funcionarios/buscar?nome=${nome}`);
}

export async function buscarFuncionarioPorId(id) {
  return request(`/funcionarios/${id}`);
}

export async function atualizarFuncionario(id, dados) {
  return request(`/funcionarios/${id}`, {
    method: "PUT",
    body: criarMultipart(dados, "funcionario"),
  });
}

export async function excluirFuncionario(id) {
  return request(`/funcionarios/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// CRUD USUARIOS
// ===============================

export async function salvarUsuario(dados) {
  return request("/usuarios", {
    method: "POST",
    body: criarMultipart(dados, "usuario"),
  });
}

export async function buscarUsuarios() {
  return request(`/usuarios/clientes`);
}

export async function buscarUsuariosPorNome(nome) {
  return request(`/usuarios/search?nome=${nome}`);
}

export async function buscarUsuarioPorId(id) {
  return request(`/usuarios/${id}`);
}

export async function atualizarUsuario(id, dados) {
  return request(`/usuarios/${id}`, {
    method: "PUT",
    body: criarMultipart(dados, "usuario"),
  });
}

export async function atualizarSenhaUsuario(id, dados) {
  return request(`/usuarios/${id}/senha`, {
    method: "PATCH",
    body: criarMultipart(dados, "usuario"),
  });
}

export async function excluirUsuario(id) {
  return request(`/usuarios/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// BUSCAR CEP
// ===============================

export async function buscarCep(cep) {
  return request(`/enderecos/cep/${cep}`);
}
