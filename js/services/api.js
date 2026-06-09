// ===============================
// CONFIGURAÇÃO DA API --> Arquivo que realiza as chamadas
// ===============================

const BASE_URL = "http://localhost:8080/api";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtZXJjYWRvLWludGVsaWdlbnRlIiwic3ViIjoidXNlckBleGFtcGxlLmNvbSIsImV4cCI6MTc4MTA0NjI4N30.6I0f5e-EubpQQhVzwpUSesJTK7u255SjA1oHWGFp5cw";

// Função Genérica
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",

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

    throw {
      status: response.status,
      message: errorData?.message || "Erro na requisição",
    };
  }

  // caso não tenha conteúdo (204)
  if (response.status === 204) return null;

  return response.json();
}

// ===============================
// CRUD PRODUTOS
// ===============================

export async function buscarProdutosPorNome(nome) {
  return request(`/produtos/contem-nome/${nome}`);
}

export async function buscarProdutos() {
  return request(`/produtos`);
}

// ===============================
// CRUD MARCAS
// ===============================

export async function buscarMarcasPorNome(nome) {
  return request(`/marcas/contem-nome/${nome}`);
}

export async function buscarMarcas() {
  return request(`/marcas`);
}

// ===============================
// CRUD CATEGORIAS
// ===============================

export async function buscarCategoriasPorNome(nome) {
  return request(`/categorias/contem-nome/${nome}`);
}

export async function buscarCategorias() {
  return request(`/categorias`);
}

// ===============================
// CRUD FORNECEDORES
// ===============================

export async function buscarFornecedoresPorNome(nome) {
  return request(`/fornecedores/contem-nome/${nome}`);
}

export async function buscarFornecedores() {
  return request(`/fornecedores`);
}
