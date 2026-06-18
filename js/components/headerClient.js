export function iniciarHeaderCliente() {
  iniciarMenuDepartamentos();
  iniciarCategoriasNav();
  atualizarCarrinhoHeader();
}

// =========================
// ATUALIZAR CARRINHO NO HEADER
// =========================

export function atualizarCarrinhoHeader() {
  const carrinho = JSON.parse(localStorage.getItem("melior_carrinho")) || [];
  let valorTotal = 0;

  carrinho.forEach((item) => {
    valorTotal += item.preco * item.quantidade;
  });

  const valueElement = document.querySelector(".cart-pill-btn .value");
  if (valueElement) {
    valueElement.textContent = valorTotal.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

// =========================
// MENU DE DEPARTAMENTOS
// =========================

function iniciarMenuDepartamentos() {
  const btnDep = document.querySelector(".btn-departamentos");
  const dropdownDep = document.getElementById("dropdown-departamentos");

  if (!btnDep || !dropdownDep) return;

  btnDep.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownDep.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdownDep.contains(e.target) && e.target !== btnDep) {
      dropdownDep.classList.remove("show");
    }
  });
}

// =========================
// NAVEGAÇÃO DAS CATEGORIAS
// =========================

function iniciarCategoriasNav() {
  const linksHeader = document.querySelectorAll(".nav-categorias a, .lista-departamentos a");

  linksHeader.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Se for um link de âncora interno (mesma página ou apontando explicitamente para index.html)
      if (href && (href.startsWith("#") || href.includes("index.html#"))) {
        const targetId = href.split("#")[1];
        const element = document.getElementById(targetId);

        // Se o elemento existe na página atual, faz o scroll suave
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Fecha o dropdown se estiver aberto
          const dropdownDep = document.getElementById("dropdown-departamentos");
          if (dropdownDep) dropdownDep.classList.remove("show");
        }
        // Se não existir (estamos em outra página), deixa o navegador seguir o link normalmente para index.html#id
      }
    });
  });
}

// =========================
// TOAST NOTIFICATION
// =========================

export function mostrarToastProduto(nomeProduto) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toastMsg = document.createElement("div");
  toastMsg.className = "toast-msg";
  toastMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${nomeProduto} adicionado ao carrinho!`;

  toastContainer.appendChild(toastMsg);

  setTimeout(() => {
    toastMsg.classList.add("esconder");
    toastMsg.addEventListener("animationend", () => {
      toastMsg.remove();
    });
  }, 3000);
}
