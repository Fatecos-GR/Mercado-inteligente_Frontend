// ==========================
// INICIALIZAÇÃO DA PÁGINA
// ==========================

export function iniciarPerfil() {
  iniciarMenuLateral();
  iniciarEdicaoPerfil();
}

// ==========================
// MENU LATERAL (ABAS)
// ==========================

function iniciarMenuLateral() {
  const navLinks = document.querySelectorAll(
    ".profile-nav a:not(.link-logout)",
  );

  const sections = document.querySelectorAll(".content-section");

  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove estado ativo
      navLinks.forEach((nav) => nav.classList.remove("active"));

      // Esconde todas as seções
      sections.forEach((sec) => {
        sec.style.display = "none";
      });

      // Ativa menu clicado
      this.classList.add("active");

      // Mostra seção correspondente
      const targetId = this.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.style.display = "block";
      }
    });
  });
}

// ==========================
// EDIÇÃO DE PERFIL
// ==========================

function iniciarEdicaoPerfil() {
  const btnEdit = document.querySelector(".btn-edit-profile");

  const inputs = document.querySelectorAll(".field-input");

  const checkboxes = document.querySelectorAll(
    '.marketing-preferences input[type="checkbox"]',
  );

  if (!btnEdit) return;

  btnEdit.addEventListener("click", () => {
    const isEditing = btnEdit.classList.contains("is-editing");

    if (isEditing) {
      salvarDados(inputs, checkboxes, btnEdit);
    } else {
      habilitarEdicao(inputs, checkboxes, btnEdit);
    }
  });
}

// ==========================
// HABILITAR EDIÇÃO
// ==========================

function habilitarEdicao(inputs, checkboxes, btnEdit) {
  inputs.forEach((input) => {
    input.disabled = false;
  });

  checkboxes.forEach((chk) => {
    chk.disabled = false;
  });

  btnEdit.classList.add("is-editing");
  btnEdit.textContent = "Salvar dados";
  btnEdit.style.backgroundColor = "var(--marrom-madeira)";

  const nameInput = document.getElementById("user-nome");

  if (nameInput) {
    nameInput.focus();
  }
}

// ==========================
// SALVAR DADOS
// ==========================

function salvarDados(inputs, checkboxes, btnEdit) {
  inputs.forEach((input) => {
    input.disabled = true;
  });

  checkboxes.forEach((chk) => {
    chk.disabled = true;
  });

  btnEdit.classList.remove("is-editing");
  btnEdit.textContent = "Editar dados";
  btnEdit.style.backgroundColor = "var(--verde-escuro)";

  // Simulação de salvamento
  alert("Dados atualizados com sucesso!");
}
