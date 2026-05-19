document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // LÓGICA DO MENU LATERAL (ABAS)
  // ===============================
  const navLinks = document.querySelectorAll(".profile-nav a:not(.logout)");
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
        document.getElementById(targetId).style.display = "block";
      });
    });
  }

  // ===============================
  // LÓGICA DE EDIÇÃO DE DADOS
  // ===============================
  const btnEdit = document.querySelector(".btn-edit-data");
  const inputs = document.querySelectorAll(".field-input");
  // Seleciona também os checkboxes para habilitar/desabilitar junto
  const checkboxes = document.querySelectorAll(
    '.checkbox-label input[type="checkbox"]',
  );

  if (btnEdit) {
    btnEdit.addEventListener("click", () => {
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
      }
    });
  }
});
