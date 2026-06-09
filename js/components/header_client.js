export function iniciarHeaderCliente() {
  iniciarMenuDepartamentos();
  iniciarCategoriasNav();
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
