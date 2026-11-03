export function getStatusValidade(dataValidade) {
  if (!dataValidade) return "SEM_VALIDADE";

  const hoje = new Date();
  const validade = new Date(dataValidade);

  const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return "Vencido";
  if (diffDias <= 5) return "Próximo da validade";

  return "OK";
}
