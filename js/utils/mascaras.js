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

export function formatarMoneyParaView(valor) {
  if (valor === null || valor === undefined) return "";

  return Number(valor).toFixed(2).replace(".", ",");
}

// ======================================
// MÁSCARA INTEIRO
// ======================================

export function aplicarMascaraInteiro(input) {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });
}

// ======================================
// MÁSCARA TELEFONE
// ======================================

export function aplicarMascaraTelefone(input) {
  input.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    valor = valor.slice(0, 11);

    // Se não houver números, limpa completamente
    if (!valor) {
      e.target.value = "";
      return;
    }

    if (valor.length <= 2) {
      valor = valor.replace(/^(\d{0,2})/, "($1");
    } else if (valor.length <= 7) {
      valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    } else {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    e.target.value = valor;
  });
}

// ======================================
// MÁSCARA CEP
// ======================================
export function aplicarMascaraCEP(input) {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, "");

    valor = valor.slice(0, 8);

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    input.value = valor;
  });
}
