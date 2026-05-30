document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
  /**
   * LÓGICA DO MENU LATERAL (ABAS)
   * Gerencia a alternância de seções na página de perfil
   */
  const navLinks = document.querySelectorAll(".profile-nav a:not(.link-logout)");
=======
  // ===============================
  // LÓGICA DO MENU LATERAL (ABAS)
  // ===============================
  const navLinks = document.querySelectorAll(".profile-nav a:not(.logout)");
>>>>>>> ab5b8d25f7e6eecc0302481e0a30c0093eacedc6
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
<<<<<<< HEAD
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          targetSection.style.display = "block";
        }
=======
        document.getElementById(targetId).style.display = "block";
>>>>>>> ab5b8d25f7e6eecc0302481e0a30c0093eacedc6
      });
    });
  }

<<<<<<< HEAD
  /**
   * LÓGICA DE EDIÇÃO DE DADOS
   * Alterna entre modo de leitura e edição no formulário de perfil
   */
  const btnEdit = document.querySelector(".btn-edit-profile");
  const inputs = document.querySelectorAll(".field-input");
  // Seleciona também os checkboxes para habilitar/desabilitar junto
  const checkboxes = document.querySelectorAll(
    '.marketing-preferences input[type="checkbox"]',
=======
  // ===============================
  // LÓGICA DE EDIÇÃO DE DADOS
  // ===============================
  const btnEdit = document.querySelector(".btn-edit-data");
  const inputs = document.querySelectorAll(".field-input");
  // Seleciona também os checkboxes para habilitar/desabilitar junto
  const checkboxes = document.querySelectorAll(
    '.checkbox-label input[type="checkbox"]',
>>>>>>> ab5b8d25f7e6eecc0302481e0a30c0093eacedc6
  );

  if (btnEdit) {
    btnEdit.addEventListener("click", () => {
<<<<<<< HEAD
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
=======
      const isEditing = btnEdit.classList.contains("editing");

      if (isEditing) {
        // SALVAR
        inputs.forEach((input) => (input.disabled = true));
        checkboxes.forEach((chk) => (chk.disabled = true));

        btnEdit.classList.remove("editing");
        btnEdit.textContent = "Editar dados";
        btnEdit.style.background = "var(--cinza-escuro)";

        alert("Dados atualizados com sucesso!");
      } else {
        // EDITAR
        inputs.forEach((input) => (input.disabled = false));
        checkboxes.forEach((chk) => (chk.disabled = false));

        btnEdit.classList.add("editing");
        btnEdit.textContent = "Salvar dados";
        btnEdit.style.background = "var(--verde-primario)";

        document.getElementById("user-nome").focus();
>>>>>>> ab5b8d25f7e6eecc0302481e0a30c0093eacedc6
      }
    });
  }
});
