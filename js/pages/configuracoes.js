import { obterPerfil } from "../utils/localStorageUtils.js";

export function isAdmin() {
  return obterPerfil() === "ADMIN";
}

export function isEstoquista() {
  return obterPerfil() === "ESTOQUISTA";
}

function configurarTabsPorPerfil(perfil) {
  const tabsPermitidas = {
    ADMIN: ["mercado", "delivery", "perfil"],
    ESTOQUISTA: ["perfil"],
  };

  const permitidas = tabsPermitidas[perfil] || [];

  document.querySelectorAll(".tab-btn").forEach((tab) => {
    const tipo = tab.dataset.tab;

    if (!permitidas.includes(tipo)) {
      tab.remove();
    }
  });

  document.querySelectorAll(".tab-content").forEach((content) => {
    const tipo = content.id.replace("tab-", "");

    if (!permitidas.includes(tipo)) {
      content.remove();
    }
  });

  if (permitidas.length) {
    const primeira = permitidas[0];

    const firstTab = document.querySelector(`.tab-btn[data-tab="${primeira}"]`);

    const firstContent = document.getElementById(`tab-${primeira}`);

    // limpa estado
    document
      .querySelectorAll(".tab-btn")
      .forEach((t) => t.classList.remove("active"));

    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));

    // ativa primeira
    firstTab?.classList.add("active");
    firstContent?.classList.add("active");
  }
}

function iniciarTabsConfiguracoes() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");

      const targetTab = tab.dataset.tab;
      const targetContent = document.getElementById(`tab-${targetTab}`);

      targetContent?.classList.add("active");
    });
  });
}

export function iniciarConfiguracoes() {
  const perfil = obterPerfil();

  configurarTabsPorPerfil(perfil);

  iniciarTabsConfiguracoes();
}
