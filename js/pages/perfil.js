document.addEventListener("DOMContentLoaded", () => {
  /**
   * LÓGICA DO MENU LATERAL (ABAS)
   * Gerencia a alternância de seções na página de perfil
   */
  const navLinks = document.querySelectorAll(".profile-nav a:not(.link-logout)");
  const sections = document.querySelectorAll(".content-section");

  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // 1. Remove classe ativa do menu e esconde todas as seções
        navLinks.forEach((nav) => nav.classList.remove("active"));
        sections.forEach((sec) => (sec.style.display = "none"));

        // 2. Ativa o item clicado e mostra a seção correspondente
        this.classList.add("active");
        const targetId = this.getAttribute("data-target");
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          targetSection.style.display = "block";
        }
      });
    });
  }

  /**
   * LÓGICA DE EDIÇÃO DE DADOS
   * Alterna entre modo de leitura e edição no formulário de perfil
   */
  const btnEdit = document.querySelector(".btn-edit-profile");
  const inputs = document.querySelectorAll(".field-input");
  // Seleciona também os checkboxes para habilitar/desabilitar junto
  const checkboxes = document.querySelectorAll(
    '.marketing-preferences input[type="checkbox"]',
  );

  if (btnEdit) {
    btnEdit.addEventListener("click", () => {
      const isEditing = btnEdit.classList.contains("is-editing");

      if (isEditing) {
        // SALVAR DADOS
        inputs.forEach((input) => (input.disabled = true));
        checkboxes.forEach((chk) => (chk.disabled = true));

        btnEdit.classList.remove("is-editing");
        btnEdit.textContent = "Editar dados";
        btnEdit.style.backgroundColor = "var(--verde-escuro)";

        // Simulação de salvamento
        alert("Dados atualizados com sucesso!");
      } else {
        // MODO EDIÇÃO
        inputs.forEach((input) => (input.disabled = false));
        checkboxes.forEach((chk) => (chk.disabled = false));

        btnEdit.classList.add("is-editing");
        btnEdit.textContent = "Salvar dados";
        btnEdit.style.backgroundColor = "var(--marrom-madeira)";

        const nameInput = document.getElementById("user-nome");
        if (nameInput) nameInput.focus();
      }
    });
  }
});
