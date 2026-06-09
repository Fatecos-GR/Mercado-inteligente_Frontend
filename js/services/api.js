// ===============================
// CONFIGURAÇÃO DA API --> Arquivo que realiza as chamadas
// ===============================

const BASE_URL = "http://localhost:8080/api";

// Função Genérica
async function request(endpoint, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
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

export async function buscarProdutos() {
  return request(`/produtos`);
}

// ===============================
// CRUD MARCAS
// ===============================

export async function buscarMarcas() {
  return request(`/marcas`);
}

// ===============================
// CRUD CATEGORIAS
// ===============================

export async function buscarCategorias() {
  return request(`/categorias`);
}
