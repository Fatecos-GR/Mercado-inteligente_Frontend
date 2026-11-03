// ======================================
// CONFIGURAÇÃO DA PREVIEW DE IMAGEM
// ======================================
export function configurarPreviewImagem(entidade) {
  const camposImagem = entidade.camposFormulario.filter(
    (campo) => campo.type === "file",
  );

  camposImagem.forEach((campo) => {
    const input = document.getElementById(campo.name);

    const preview = document.getElementById(`${campo.name}-preview`);

    const texto = document.getElementById(`${campo.name}-text`);

    const btnRemover = document.getElementById(`${campo.name}-remove`);

    if (!input || !preview) return;

    input.addEventListener("change", () => {
      const arquivo = input.files?.[0];

      if (!arquivo) {
        preview.src = "";
        preview.style.display = "none";

        btnRemover.style.display = "none";

        texto.textContent = "Selecionar imagem";

        return;
      }

      texto.textContent = arquivo.name;

      const reader = new FileReader();

      reader.onload = (event) => {
        preview.src = event.target.result;

        preview.style.display = "block";

        btnRemover.style.display = "inline-flex";
      };

      reader.readAsDataURL(arquivo);
    });

    btnRemover.addEventListener("click", () => {
      input.value = "";

      preview.src = "";

      preview.style.display = "none";

      btnRemover.style.display = "none";

      texto.textContent = "Selecionar imagem";
    });
  });
}

// ======================================
// PREENCHIMENTO DE PREVIEW
// ======================================

export function preencherPreviewImagem(entidade, dados) {
  const campoImagem = entidade.camposFormulario.find(
    (campo) => campo.type === "file",
  );

  if (!campoImagem) return;

  const preview = document.getElementById(`${campoImagem.name}-preview`);

  if (!preview) return;

  if (!dados.imagem) return;

  preview.src = dados.imagem;

  preview.style.display = "block";
}
