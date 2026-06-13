export const tiposLogin = {
  cliente: {
    tituloPagina: "Login | Melior",

    tituloFormulario: "Faça Login",

    tituloInfo: "Bem-vindo",

    descricao:
      "Ainda não tem uma conta? Junte-se a nós para uma experiência de compra única.",

    mostrarHeader: true,

    mostrarFooter: true,

    mostrarCadastro: true,

    rotaLogin: "/login.html?tipo=cliente",

    rotaSucesso: "/index.html",
  },

  admin: {
    tituloPagina: "Login Administrativo | Melior",

    tituloFormulario: "Área Administrativa",

    tituloInfo: "Painel Administrativo",

    descricao: "Acesso restrito aos colaboradores autorizados.",

    mostrarHeader: false,

    mostrarFooter: false,

    mostrarCadastro: false,

    rotaLogin: "/login.html?tipo=admin",

    rotaSucesso: "/dashboard.html",
  },
};
