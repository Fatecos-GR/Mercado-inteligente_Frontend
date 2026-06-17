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
  const linksCat = document.querySelectorAll(".nav-categorias a");

  linksCat.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Scroll suave para IDs
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();

        const targetId = href.substring(1);
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        return;
      }

      // Navegação normal para páginas HTML
      if (href && href.endsWith(".html")) return;

      e.preventDefault();

      const titulo = link.innerText;

      const secoes = document.querySelectorAll(
        ".vitrine-title, #recommendations-header h2",
      );

      let encontrou = false;

      secoes.forEach((secao) => {
        if (!encontrou && secao.innerText.includes(titulo)) {
          secao.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          encontrou = true;
        }
      });

      if (!encontrou) {
        window.location.href = "index.html";
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
