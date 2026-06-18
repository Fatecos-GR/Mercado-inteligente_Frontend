import { possuiPerfil } from "./utils/authGuard.js";

import { formatarTelefone } from "./utils/mascaras.js";

import { getStatusValidade } from "./utils/validadeUtils.js";

// ======================================
// CARD DE PRODUTO (CLIENTE)
// ======================================
export function renderClienteProdutoCard(produto) {
  const imagem =
    produto.imagem && produto.imagem.trim() !== ""
      ? produto.imagem
      : "/img/placeholder.png";

  const preco = Number(produto.preco || 0);

  const precoFormatado = preco.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  const unidade = produto.unidade || "unid";

  const estoque = Number(produto.estoqueDisponivel || 0);

  const semEstoque = estoque <= 0;

  return `
    <div class="product-card" data-id="${produto.id}"
  data-estoque="${produto.estoqueDisponivel || 0}">

      <a href="detalhes_prod.html?id=${produto.id}" class="product-link">

        <div class="card-image-wrapper">
          <img
            src="${imagem}"
            alt="${produto.nome || "Produto"}"
            loading="lazy"
          />
        </div>

        <h3 class="product-title">
          ${produto.nome || "Sem nome"}
        </h3>

      </a>

      <span class="product-unit">
        ${unidade}
      </span>

      <div class="product-pricing">
        <span class="price-current">
          R$ ${precoFormatado}
        </span>
      </div>

      <div class="product-actions-container">

  <div class="card-quantity-control">
    <button type="button" class="btn-qty-minus">-</button>

    <input
      type="number"
      class="input-qty"
      value="1"
      min="1"
      max="${estoque}"
      id="qty-${produto.id}"
    />

    <button type="button" class="btn-qty-plus">+</button>
  </div>

  <button
    class="btn-add-cart"
    data-id="${produto.id}"
    ${semEstoque ? "disabled" : ""}
  >
    ${
      semEstoque
        ? "Sem estoque"
        : 'Adicionar <i class="fa-solid fa-cart-shopping"></i>'
    }
  </button>

</div>
</div>
  `;
}

// ======================================
// CARD DE PRODUTO (ADMIN)
// ======================================

export function renderAdminProdutoCard(produto) {
  const status =
    produto.estoqueDisponivel > 10 ? "Em estoque" : "Baixo estoque";

  const warningClass = produto.estoqueDisponivel <= 10 ? "warning" : "";

  const validadeStatus = getStatusValidade(produto.validade);
  const validadeClass =
    validadeStatus === "Vencido"
      ? "expired"
      : validadeStatus === "Próximo da validade"
        ? "warning"
        : "ok";

  const podeEditar = possuiPerfil(["ADMIN"]);

  return `
    <article class="product-card">

      <!-- TOPO -->
      <div class="product-card-top">

        <div class="product-icon">
          <i class="fa-solid fa-box"></i>
        </div>

        <div class="product-badges">
          <span class="product-status ${warningClass}">
            ${status}
          </span>

          <span class="product-expiry ${validadeClass}">
            ${validadeStatus}
          </span>
        </div>

      </div>

      <!-- INFO -->
      <div class="product-info">

        <h3>${produto.nome}</h3>

        <span class="product-category">
          Categoria: ${produto.categoriaNome}
        </span>

        <span class="product-brand">
          Marca: ${produto.marcaNome}
        </span>

      </div>

      <!-- DETALHES -->
      <div class="product-details">

        <div class="detail-item">
          <span>Preço</span>
          <strong>R$ ${produto.preco}</strong>
        </div>

        <div class="detail-item">
          <span>Estoque</span>
          <strong>${produto.estoqueDisponivel}</strong>
        </div>

        <div class="detail-item">
          <span>Validade</span>
          <strong>${produto.validade}</strong>
        </div>

      </div>

      <!-- AÇÕES -->
      <div class="product-actions">

        ${
          podeEditar
            ? `
          <a href="form_admin.html?tipo=produtos&id=${produto.id}"
             class="btn-card-edit">
            <i class="fa-solid fa-pen"></i>
          </a>
        `
            : ""
        }

        <a href="form_admin.html?tipo=estoque&id=${produto.id}"
           class="btn-card-stock">
          <i class="fa-solid fa-boxes-stacked"></i>
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
    <a
      href="form_admin.html?tipo=marcas&id=${marca.id}"
      class="brand-card"
    >

      <div class="brand-card-left">

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

        <div class="brand-info">

          <h3>
            ${marca.nome}
          </h3>

          <p>
            ${marca.descricao || "Sem descrição cadastrada."}
          </p>

        </div>

      </div>

      <div class="brand-card-right">
        <i class="fa-solid fa-pen brand-btn-edit" ></i>
      </div>

    </a>
  `;
}

// ======================================
// CARD DE CATEGORIA (ADMIN)
// ======================================

export function renderAdminCategoriaCard(categoria) {
  return `
    <a
      href="form_admin.html?tipo=categorias&id=${categoria.id}"
      class="brand-card"
    >

      <div class="brand-card-left">

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

        <div class="brand-info">

          <h3>
            ${categoria.nome}
          </h3>

          <p>
            ${categoria.descricao || "Sem descrição cadastrada."}
          </p>

        </div>

      </div>

      <div class="brand-card-right">
        <i class="fa-solid fa-pen brand-btn-edit" ></i>
      </div>

    </a>
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
    <a
      href="form_admin.html?tipo=fornecedores&id=${fornecedor.id}"
      class="brand-card supplier-card"
    >

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

          <p>
            ${
              fornecedor.endereco?.cidade
                ? `${fornecedor.endereco.cidade} - ${fornecedor.endereco.estado}`
                : "Endereço não informado"
            }
          </p>

        </div>

      </div>

      <div class="brand-card-right">
        <i class="fa-solid fa-pen brand-btn-edit"></i>
      </div>

    </a>
  `;
}

// ======================================
// CARD DE FUNCIONÁRIO (ADMIN)
// ======================================

export function renderAdminFuncionarioCard(funcionario) {
  const tipoFormatado =
    funcionario.tipoFuncionario === "ADMIN" ? "Administrador" : "Estoquista";

  const badgeClass =
    funcionario.tipoFuncionario === "ADMIN" ? "admin" : "estoquista";

  const telefoneFormatado = funcionario.telefone
    ? formatarTelefone(funcionario.telefone)
    : "Telefone não informado";

  return `
    <a
      href="form_admin.html?tipo=funcionarios&id=${funcionario.id}"
      class="employee-card"
    >

      <div class="employee-card-left">

        <div class="employee-image">

          ${
            funcionario.imagem
              ? `
                <img
                  src="${funcionario.imagem}"
                  alt="${funcionario.nome}"
                />
              `
              : `
                <i class="fa-solid fa-user"></i>
              `
          }

        </div>

        <div class="employee-info">

          <h3>
            ${funcionario.nome}
            ${funcionario.sobrenome ?? ""}
          </h3>

          <p>
            ${funcionario.email}
          </p>

          <p>
            ${telefoneFormatado || "Telefone não informado"}
          </p>

          <span class="employee-badge ${badgeClass}">
            ${tipoFormatado}
          </span>

        </div>

      </div>

      <div class="employee-card-right">
        <i class="fa-solid fa-pen"></i>
      </div>

    </a>
  `;
}

// ======================================
// CARD DE USUÁRIO (ADMIN)
// ======================================
export function renderAdminUsuarioCard(usuario) {
  // Telefone no formato correto
  const telefoneFormatado = usuario.telefone
    ? formatarTelefone(usuario.telefone)
    : "Telefone não informado";
  return `
    <div class="employee-card">

      <div class="employee-card-left">

        <div class="employee-image">

          ${
            usuario.imagem
              ? `
                <img
                  src="${usuario.imagem}"
                  alt="${usuario.nome}"
                />
              `
              : `
                <i class="fa-solid fa-user"></i>
              `
          }

        </div>

        <div class="employee-info">

          <h3>
            ${usuario.nome}
            ${usuario.sobrenome ?? ""}
          </h3>

          <p>
            ${usuario.email}
          </p>

          <p>
            ${telefoneFormatado || "Telefone não informado"}
          </p>

        </div>

      </div>

    </div>
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
        ${campo.readonly ? "readonly" : ""}
         ${campo.disabled ? "disabled" : ""}
      />

    </div>
  `;
}

// ======================================
// RENDER PASSWORD DE FORMULÁRIO (ADMIN)
// ======================================
function renderPasswordFormularioAdmin(campo) {
  return `
    <div class="admin-form-group">

      <label for="${campo.name}">
        ${campo.label}
      </label>

      <div class="input-wrapper">

        <input
          type="password"
          id="${campo.name}"
          name="${campo.name}"
          ${campo.required ? "required" : ""}
        />

        <button
          type="button"
          class="btn-toggle-password"
        >
          <i class="fas fa-eye"></i>
        </button>

      </div>

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

  // PASSWORD
  if (campo.type === "password") {
    return renderPasswordFormularioAdmin(campo);
  }

  // SELECT
  if (campo.type === "select") {
    return renderSelectFormularioAdmin(campo);
  }

  // ARQUIVO
  if (campo.type === "file") {
    return renderFileFormularioAdmin(campo);
  }

  //SEÇÃO (ENDEREÇO)
  if (campo.type === "section") {
    return `
    <div class="admin-form-section">
      <h3>${campo.title}</h3>
    </div>
  `;
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

       ${
         modoEdicao
           ? `
        <button
          type="button"
          id="btn-excluir"
          class="admin-btn-delete"
        >
          <i class="fa-solid fa-trash"></i>
          Excluir ${entidade.singular}
        </button>
      `
           : ""
       }

    </div>
  `;
}

// ======================================
// MODAL
// ======================================
export function renderModal(config, mensagem) {
  return `
    <div class="modal-overlay">

      <div class="modal ${config.classe}">

        <div class="modal-header">

          <i class="${config.icone}"></i>

          <h3>${config.titulo}</h3>

        </div>

        <div class="modal-body">

          <p>${mensagem}</p>

        </div>

        <div class="modal-footer">

          ${
            config.possuiCancelamento
              ? `
              <button
                id="modal-btn-cancelar"
                class="btn-modal btn-modal-secondary"
              >
                ${config.textoBotaoCancelar}
              </button>
            `
              : ""
          }

          <button
            id="modal-btn-confirmar"
            class="btn-modal btn-modal-primary"
          >
            ${config.textoBotaoConfirmar}
          </button>

        </div>

      </div>

    </div>
  `;
}

// ======================================
// FILTROS PARA TELA DE GESTÃO
// ======================================

export function renderFiltrosGestao(entidade) {
  if (!entidade.filtros?.length) {
    return "";
  }

  return `
    <div class="gestao-filtros-wrapper">
      ${entidade.filtros
        .map((filtro) => {
          const id = filtro.parametro.replace("Id", "");

          if (filtro.opcoes?.length) {
            return `
              <select
                id="filtro-${id}"
                class="gestao-filtro"
              >
                <option value="">
                  ${filtro.placeholder}
                </option>

                ${filtro.opcoes
                  .map(
                    (opcao) => `
                      <option value="${opcao.value}">
                        ${opcao.label}
                      </option>
                    `,
                  )
                  .join("")}
              </select>
            `;
          }

          return `
            <select
              id="filtro-${id}"
              class="gestao-filtro"
            >
              <option value="">
                ${filtro.placeholder}
              </option>
            </select>
          `;
        })
        .join("")}

      <button
        type="button"
        id="btn-limpar-filtros"
        class="btn-limpar-filtros"
      >
        <i class="fa-solid fa-filter-circle-xmark"></i>
        Limpar
      </button>
    </div>
  `;
}

// ======================================
// CARD SKELETON (GESTÃO)
// ======================================

export function renderSkeletonGestao(quantidade = 6) {
  return Array(quantidade)
    .fill(
      `
      <div class="brand-card">

        <div class="brand-card-left">

          <div class="brand-image skeleton skeleton-image"></div>

          <div class="brand-info">

            <div class="skeleton skeleton-title"></div>

            <br>

            <div class="skeleton skeleton-text"></div>

            <br>

            <div class="skeleton skeleton-text"></div>

          </div>

        </div>

      </div>
      `,
    )
    .join("");
}

// ======================================
// CARD DE CATEGORIA (CLIENTE)
// ======================================
export function renderClienteCategoriaCard(categoria) {
  const imagem =
    categoria.imagem && categoria.imagem.trim() !== ""
      ? categoria.imagem
      : "/img/placeholder.png";

  return `
    <a 
      class="category-card" 
      data-id="${categoria.id}"
      data-slug="${categoria.slug || ""}"
      href="#sec-${categoria.slug || categoria.id}"
    >
      <div class="category-circle">
        <img
          src="${imagem}"
          alt="${categoria.nome}"
          class="category-img"
        />
      </div>

      <h3 class="category-title">
        ${categoria.nome}
      </h3>
    </a>
  `;
}

// ======================================
// SEÇÃO DE CATEGORIA (CLIENTE) - DINÂMICA
// ======================================
export function renderClienteCategoriaSection(categoria, produtos) {
  const produtosFiltrados = produtos || [];

  const slug = categoria.slug || categoria.id;

  return `
    <section id="sec-${slug}" class="home-vitrine">

      <h2 class="vitrine-title">${categoria.nome}</h2>

      <div class="vitrine-container">

        <button class="vitrine-nav-btn prev" data-target="grid-${slug}">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="products-wrapper">
          <div id="grid-${slug}" class="products-grid">
            ${produtosFiltrados.map(renderClienteProdutoCard).join("")}
          </div>
        </div>

        <button class="vitrine-nav-btn next" data-target="grid-${slug}">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

      </div>

    </section>
  `;
}

// ======================================
// CARD DE OFERTA PARA ABA DA HOME
// ======================================
export function renderClienteOfertaCard(produto) {
  const imagem = produto.imagem?.trim() || "/img/placeholder.png";

  const percentual =
    produto.precoAnterior > 0
      ? Math.round(
          ((produto.precoAnterior - produto.preco) / produto.precoAnterior) *
            100,
        )
      : 0;

  return `
    <article
      class="product-card oferta-card"
      data-estoque="${produto.estoqueDisponivel}"
    >

      <span class="oferta-badge">
        -${percentual}%
      </span>

      <a href="detalhes_prod.html?id=${produto.id}">
        <img
          src="${imagem}"
          alt="${produto.nome}"
          class="product-image"
        />
      </a>

      <div class="product-info">

        <h3 class="product-title">
          ${produto.nome}
        </h3>

        <div class="price-box">

          <span class="price-old">
            R$ ${Number(produto.precoAnterior).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </span>

          <span class="price-current">
            R$ ${Number(produto.preco).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </span>

        </div>

        <small class="oferta-validade">
          Oferta até ${new Date(produto.validade).toLocaleDateString("pt-BR")}
        </small>

      </div>

      <button
        class="btn-add-cart"
        data-id="${produto.id}"
      >
        Adicionar
        <i class="fa-solid fa-cart-shopping"></i>
      </button>

    </article>
  `;
}
