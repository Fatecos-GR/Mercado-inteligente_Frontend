// ===============================
// FUNÇÃO AUXILIAR PARA CARREGAR OS COMPONENTES HTML
// ===============================

async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

// ===============================
// CARREGAR HEADER E FOOTER
// ===============================

async function carregarLayout() {
  // Função pede o ID do elemento e o arquivo html dele
  await loadComponent("main-header", "components/header.html");
  await loadComponent("main-footer", "components/footer.html");
}

// ===============================
// START PRINCIPAL
// ===============================

async function start() {
  //Componentes Modularizados
  await carregarLayout();
}

start();
