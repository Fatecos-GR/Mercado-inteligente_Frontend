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

// ===============================
// CRUD PRODUTOS
// ===============================

export async function buscarProdutosPorNome(nome) {
  return request(`/produtos/search?nome=${nome}`);
}

export async function buscarProdutos() {
  return request(`/produtos`);
}

// ===============================
// CRUD MARCAS
// ===============================

export async function excluirMarca(id) {
  return request(`/marcas/${id}`, {
    method: "DELETE",
  });
}

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

// ===============================
// CRUD CATEGORIAS
// ===============================

export async function salvarCategoria(dados) {
  return request("/categorias", {
    method: "POST",
    body: criarMultipart(dados, "marca"),
  });
}

export async function buscarCategoriasPorNome(nome) {
  return request(`/categorias/search?nome=${nome}`);
}

export async function buscarCategorias() {
  return request(`/categorias`);
}

// ===============================
// CRUD FORNECEDORES
// ===============================

export async function buscarFornecedoresPorNome(nome) {
  return request(`/fornecedores/search?nome=${nome}`);
}

export async function buscarFornecedores() {
  return request(`/fornecedores`);
}
