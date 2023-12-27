/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log("Aplicativo carregado.");
    },
    registered() {
      // console.log("O trabalhador do serviço foi registrado.");
    },
    cached() {
      // console.log("O conteúdo foi armazenado em cache para uso off-line.");
    },
    updatefound() {
      console.log("Novo conteúdo está sendo baixado.");
    },
    updated() {
      console.log("Novo conteúdo, por favor atualize a pagina!");
    },
    offline() {
      console.log("O aplicativo está sendo executado no modo offline.");
    },
    error(error) {
      console.error("Erro durante o registro do service worker:", error);
    },
  });
}
