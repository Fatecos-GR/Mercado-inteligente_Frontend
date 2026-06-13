// ======================================
// IMPORTS
// ======================================

import { buscarCep } from "../services/api.js";
import { aplicarMascaraCEP } from "./mascaras.js";

// ======================================
// CONFIGURAÇÃO DA BUSCA DE CEP
// ======================================

export function configurarBuscaCEP(modoEdicao = false) {
  const cepInput = document.getElementById("cep");

  if (!cepInput) return;

  aplicarMascaraCEP(cepInput);

  if (!modoEdicao) {
    bloquearCamposEndereco();
  } else {
    bloquearCamposEnderecoModoEdicao();
    configurarEnderecoModoEdicao();
  }

  cepInput.addEventListener("input", async () => {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length === 0) {
      limparEndereco();
      bloquearCamposEndereco();
      return;
    }

    if (cep.length !== 8) return;

    try {
      const endereco = await buscarCep(cep);

      preencherEndereco(endereco);

      liberarCamposEndereco();
    } catch (erro) {
      console.error("Erro ao buscar CEP:", erro);
    }
  });
}

// ======================================
// BLOQUEAR CAMPOS
// ======================================

function bloquearCamposEndereco() {
  ["logradouro", "bairro", "cidade", "estado", "numero", "complemento"].forEach(
    (id) => {
      const campo = document.getElementById(id);

      if (campo) {
        campo.disabled = true;
      }
    },
  );
}

// ======================================
// LIBERAR CAMPOS EDITÁVEIS
// ======================================

function liberarCamposEndereco() {
  ["numero", "complemento"].forEach((id) => {
    const campo = document.getElementById(id);

    if (campo) {
      campo.disabled = false;
    }
  });
}

// ======================================
// PREENCHER ENDEREÇO
// ======================================

export function preencherEndereco(endereco) {
  const mapa = {
    cep: endereco.cep,
    logradouro: endereco.logradouro,
    numero: endereco.numero,
    complemento: endereco.complemento,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    estado: endereco.estado,
  };

  Object.entries(mapa).forEach(([id, valor]) => {
    const campo = document.getElementById(id);

    if (campo) {
      campo.value = valor || "";
    }
  });
}

// ======================================
// LIMPAR ENDEREÇO
// ======================================
function limparEndereco() {
  ["logradouro", "bairro", "cidade", "estado", "numero", "complemento"].forEach(
    (id) => {
      const campo = document.getElementById(id);

      if (campo) {
        campo.value = "";
      }
    },
  );
}

export function configurarEnderecoModoEdicao() {
  const numero = document.getElementById("numero");
  const complemento = document.getElementById("complemento");

  if (numero) numero.disabled = false;
  if (complemento) complemento.disabled = false;
}

function bloquearCamposEnderecoModoEdicao() {
  ["logradouro", "bairro", "cidade", "estado"].forEach((id) => {
    const campo = document.getElementById(id);

    if (campo) {
      campo.disabled = true;
    }
  });
}
