// ======================================
// CARD DE PRODUTO (ADMIN)
// ======================================

export function renderAdminProdutoCard(produto) {
  const status =
    produto.estoqueDisponivel > 10 ? "Em estoque" : "Baixo estoque";

  const warningClass = produto.estoqueDisponivel <= 10 ? "warning" : "";

  return `
    <article class="product-card"> 

      <div class="product-card-top">

        <div class="product-icon">
          <i class="fa-solid fa-box"></i>
        </div>

        <div class="product-status ${warningClass}">
          ${status}
        </div>

      </div>

      <div class="product-info">

        <h3>${produto.nome}</h3>

        <span class="product-category">
          Categoria: ${produto.categoriaNome}
        </span>

        <span class="product-brand">
          Marca: ${produto.marcaNome}
        </span>

      </div>

      <div class="product-details">

        <div class="detail-item">
          <span>Preço</span>

          <strong>
            R$ ${produto.preco}
          </strong>
        </div>

        <div class="detail-item">
          <span>Quantidade</span>

          <strong>
            ${produto.estoqueDisponivel} un.
          </strong>
        </div>

      </div>

      <div class="product-actions">

        <a href="#" class="btn-edit">
          <i class="fa-solid fa-pen"></i>
          Editar
        </a>

        <a href="#" class="btn-delete">
          <i class="fa-solid fa-trash"></i>
          Excluir
        </a>

      </div>

    </article>
  `;
}

// ======================================
// CARD DE MARCA (ADMIN)
// ======================================

export function renderAdminMarcaCard(marca) {
  return `
    <article class="brand-card">

      <!-- ESQUERDA -->
      <div class="brand-card-left">

        <!-- IMAGEM -->
        <div class="brand-image">

          ${
            marca.imagem
              ? `
                <img 
                  src="${marca.imagem}" 
                  alt="${marca.nome}"
                />
              `
              : `
                <i class="fa-solid fa-tag"></i>
              `
          }

        </div>

        <!-- INFORMAÇÕES -->
        <div class="brand-info">

          <h3>
            ${marca.nome}
          </h3>

          <p>
            ${marca.descricao || "Sem descrição cadastrada."}
          </p>

        </div>

      </div>

      <!-- AÇÕES -->
      <div class="brand-card-right">

        <!-- EDITAR -->
        <a
          href="form_admin.html?tipo=marcas&id=${marca.id}"
          class="brand-btn-edit"
        >
          <i class="fa-solid fa-pen"></i>
          Editar
        </a>

        <!-- EXCLUIR -->
        <a href="#"  class="brand-btn-delete"  data-id="${marca.id}">

          <i class="fa-solid fa-trash"></i>

          Excluir

        </a>

      </div>

    </article>
  `;
}

// ======================================
// CARD DE CATEGORIA (ADMIN)
// ======================================

export function renderAdminCategoriaCard(categoria) {
  return `
    <article class="brand-card">

      <!-- ESQUERDA -->
      <div class="brand-card-left">

        <!-- IMAGEM -->
        <div class="brand-image">

          ${
            categoria.imagem
              ? `
                <img 
                  src="${categoria.imagem}" 
                  alt="${categoria.nome}"
                />
              `
              : `
                <i class="fa-solid fa-tag"></i>
              `
          }

        </div>

        <!-- INFORMAÇÕES -->
        <div class="brand-info">

          <h3>
            ${categoria.nome}
          </h3>

          <p>
            ${categoria.descricao || "Sem descrição cadastrada."}
          </p>

        </div>

      </div>

      <!-- AÇÕES -->
      <div class="brand-card-right">

        <!-- EDITAR -->
        <a href="#" class="brand-btn-edit">

          <i class="fa-solid fa-pen"></i>

          Editar

        </a>

        <!-- EXCLUIR -->
        <a href="#" class="brand-btn-delete">

          <i class="fa-solid fa-trash"></i>

          Excluir

        </a>

      </div>

    </article>
  `;
}

// ======================================
// RESULTADOS DE BUSCA (TELA DE GESTÃO)
// ======================================
export function renderResultadoBuscaGestao(item) {
  return `
    <div
      class="search-result-item"
      data-id="${item.id}"
    >

      <div class="search-result-title">
        ${item.nome}
      </div>

      <div class="search-result-description">
        ${item.descricao || ""}
      </div>

    </div>

     `;
}

// ======================================
// CARD DE FORNECEDOR (ADMIN)
// ======================================

export function renderAdminFornecedorCard(fornecedor) {
  return `
    <article class="brand-card supplier-card">

      <div class="brand-card-left">

        <div class="brand-image">
          ${
            fornecedor.imagem
              ? `
                <img 
                  src="${fornecedor.imagem}" 
                  alt="${fornecedor.nome}"
                />
              `
              : `
                <i class="fa-solid fa-truck-ramp-box"></i>
              `
          }
        </div>

        <div class="brand-info">
          <h3>
            ${fornecedor.nome}
          </h3>
          <p class="supplier-doc">
            <strong>CNPJ:</strong> ${fornecedor.cnpj || "Não informado"}
          </p>
          <p class="supplier-contact">
            <strong>Contato:</strong> ${fornecedor.contato || "Sem telefone/e-mail"}
          </p>
        </div>

      </div>

      <div class="brand-card-right">

        <a href="#" class="brand-btn-edit">
          <i class="fa-solid fa-pen"></i>
          Editar
        </a>

        <a href="#" class="brand-btn-delete">
          <i class="fa-solid fa-trash"></i>
          Excluir
        </a>

      </div>

    </article>
  `;
}

// ======================================
// RENDER INPUT DE FORMULÁRIO (ADMIN)
// ======================================

function renderInputFormularioAdmin(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <input
        type="${campo.type}"
        id="${campo.name}"
        name="${campo.name}"
        ${campo.required ? "required" : ""}
      />

    </div>
  `;
}

// ======================================
// RENDER TEXTAREA DE FORMULÁRIO (ADMIN)
// ======================================

function renderTextareaFormularioAdmin(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <textarea
        id="${campo.name}"
        name="${campo.name}"
        rows="4"
        ${campo.required ? "required" : ""}
      ></textarea>

    </div>
  `;
}

// ======================================
// RENDER SELECT DE FORMULÁRIO (ADMIN)
// ======================================

function renderSelectFormularioAdmin(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <select
        id="${campo.name}"
        name="${campo.name}"
        ${campo.required ? "required" : ""}
      >

        <option value="">
          Selecione...
        </option>

      </select>

    </div>
  `;
}

// ======================================
// RENDER FILE DE FORMULÁRIO (ADMIN)
// ======================================
function renderFileFormularioAdmin(campo) {
  return `
    <div class="admin-form-group">

      <label>
        ${campo.label}
      </label>

      <label
        for="${campo.name}"
        class="custom-file-upload"
      >
        <i class="fa-solid fa-image"></i>

        <span id="${campo.name}-text">
          Selecionar imagem
        </span>
      </label>

      <input
        type="file"
        id="${campo.name}"
        name="${campo.name}"
        accept="image/*"
        hidden
      />

      <div
        class="image-preview-container"
        id="${campo.name}-preview-container"
      >

        <img
          id="${campo.name}-preview"
          class="image-preview"
          style="display:none;"
        />

        <button
          type="button"
          class="btn-remove-image"
          id="${campo.name}-remove"
          style="display:none;"
        >
          Remover imagem
        </button>

      </div>

    </div>
  `;
}

// ======================================
// RENDER CAMPO FORMULÁRIO DE ENTIDADE (ADMIN)
// ======================================

export function renderCampoFormularioAdmin(campo) {
  // TEXTAREA
  if (campo.type === "textarea") {
    return renderTextareaFormularioAdmin(campo);
  }

  // SELECT
  if (campo.type === "select") {
    return renderSelectFormularioAdmin(campo);
  }

  if (campo.type === "file") {
    return renderFileFormularioAdmin(campo);
  }

  // INPUT PADRÃO
  return renderInputFormularioAdmin(campo);
}

// ======================================
// RENDER FORMULÁRIO DE ENTIDADE (ADMIN)
// ======================================

export function renderFormularioEntidadeAdmin(entidade, modoEdicao = false) {
  const form = document.getElementById("admin-form");

  const camposHTML = entidade.camposFormulario
    .map(renderCampoFormularioAdmin)
    .join("");

  form.innerHTML = `
    ${camposHTML}

    <div class="admin-form-actions">

      <button
        type="submit"
        class="admin-btn-submit"
      >

       ${
         modoEdicao
           ? `Atualizar ${entidade.singular}`
           : `Salvar ${entidade.singular}`
       }

      </button>

    </div>
  `;
}
