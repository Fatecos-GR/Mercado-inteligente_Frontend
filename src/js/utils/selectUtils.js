// utils/selectUtils.js

import {
  buscarMarcas,
  buscarCategorias,
  buscarFornecedores,
} from "../services/api.js";

async function buscarDados(tipo) {
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

export async function popularSelectGenerico(
  select,
  tipo,
  placeholder = "Todos",
) {
  const dados = await buscarDados(tipo);

  select.innerHTML = `
    <option value="">
      ${placeholder}
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
