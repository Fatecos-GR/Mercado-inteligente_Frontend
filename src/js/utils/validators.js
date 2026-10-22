import { mostrarErro } from "./formUtils.js";
import { estaEditando } from "./formContext.js";

export function validarCep(elemento) {
  const cep = elemento.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    mostrarErro(elemento, "CEP inválido.");
    return false;
  }

  return true;
}

export function validarEmail(elemento) {
  const email = elemento.value.trim();

  if (!email) {
    mostrarErro(elemento, "Informe o e-mail.");
    return false;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexEmail.test(email)) {
    mostrarErro(elemento, "Informe um e-mail válido.");
    return false;
  }

  return true;
}

export function validarTelefone(elemento) {
  const telefone = elemento.value.replace(/\D/g, "");

  if (telefone.length !== 11) {
    mostrarErro(elemento, "Informe um telefone válido.");
    return false;
  }

  return true;
}

export function validarValidade(elemento) {
  if (!elemento.value) {
    return true;
  }

  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  const validade = new Date(elemento.value);

  if (validade < hoje) {
    mostrarErro(elemento, "A validade não pode ser uma data passada.");

    return false;
  }

  return true;
}

export function validarRequired(campo, elemento) {
  if (campo.required && !elemento.value.trim()) {
    mostrarErro(elemento, `${campo.label} é obrigatório.`);

    return false;
  }

  return true;
}

export function validarSenhaFuncionario() {
  const senha = document.getElementById("senha");
  const confirmarSenha = document.getElementById("confirmarSenha");

  const senhaValor = senha?.value.trim() || "";
  const confirmarValor = confirmarSenha?.value.trim() || "";

  // ==========================
  // MODO EDIÇÃO
  // ==========================
  if (estaEditando()) {
    // não alterou senha
    if (!senhaValor && !confirmarValor) {
      return true;
    }

    // preencheu um dos campos
    if (!senhaValor || !confirmarValor) {
      mostrarErro(
        confirmarSenha,
        "Preencha senha e confirmação para alterar a senha.",
      );

      return false;
    }
  }

  // mínimo 6 caracteres
  if (senhaValor.length < 6) {
    mostrarErro(senha, "A senha deve ter no mínimo 6 caracteres.");

    return false;
  }

  // comparação
  if (senhaValor !== confirmarValor) {
    mostrarErro(confirmarSenha, "As senhas não coincidem.");

    return false;
  }

  return true;
}
