// ======================================
// MÁSCARA MONETÁRIA
// ======================================

export function aplicarMascaraMoeda(input) {
  input.addEventListener("input", (e) => {
    let valor = e.target.value;

    // REMOVE TUDO QUE NÃO FOR NÚMERO
    valor = valor.replace(/\D/g, "");

    // EVITA CAMPO VAZIO
    if (valor === "") {
      e.target.value = "";

      return;
    }

    // TRANSFORMA EM DECIMAL
    valor = (Number(valor) / 100).toFixed(2);

    // TROCA PONTO POR VÍRGULA
    valor = valor.replace(".", ",");

    // ADICIONA PONTOS DE MILHAR
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    e.target.value = valor;
  });
}

// ======================================
// MÁSCARA INTEIRO
// ======================================

export function aplicarMascaraInteiro(input) {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });
}
