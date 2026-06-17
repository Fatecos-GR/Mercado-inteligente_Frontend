// utils/filterUtils.js

export function getFiltro(nome) {
  const params = new URLSearchParams(window.location.search);

  return params.get(nome) || "";
}

export function atualizarFiltro(nome, valor) {
  const url = new URL(window.location);

  if (valor) {
    url.searchParams.set(nome, valor);
  } else {
    url.searchParams.delete(nome);
  }

  history.replaceState({}, "", url);
}

export function obterFiltros() {
  const params = new URLSearchParams(window.location.search);

  return {
    search: params.get("search") || "",
    marcaId: params.get("marcaId") || "",
    categoriaId: params.get("categoriaId") || "",
    fornecedorId: params.get("fornecedorId") || "",
    baixoEstoque: params.get("baixoEstoque") || "",
  };
}
