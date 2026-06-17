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

    e.target.value = formatarTelefone(valor);
  });
}

export function formatarTelefone(valor) {
  valor = String(valor || "").replace(/\D/g, "");

  // garante no máximo 11 números
  valor = valor.slice(0, 11);

  if (!valor) return "";

  if (valor.length <= 2) {
    return valor.replace(/^(\d{0,2})/, "($1");
  }

  if (valor.length <= 6) {
    return valor.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  if (valor.length <= 10) {
    return valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }

  return valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
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

// ======================================
// DATA E HORA PARA INPUT TYPE="datetime-local"
// ======================================

export function formatarDataHoraParaInput(valor) {
  if (!valor) return "";

  const data = new Date(valor);

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}
