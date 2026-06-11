// js/pages/configuracoes.js

export function iniciarConfiguracoes() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  // Verifica se os botões existem na tela antes de rodar
  if (tabs.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // 1. Remove a classe 'active' de todas as abas e conteúdos
        tabs.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));

        // 2. Adiciona a classe 'active' apenas na aba que foi clicada
        tab.classList.add("active");

        // 3. Pega o ID da aba (mercado, delivery ou perfil) e mostra o bloco certo
        const targetTab = tab.getAttribute("data-tab");
        const targetContent = document.getElementById(`tab-${targetTab}`);

        if (targetContent) {
          targetContent.classList.add("active");
        }
      });
    });
  }
}
