/* eslint-disable comma-dangle */
import { watchEffect } from "vue";
import { IApp } from "../../app";
import { GitHubRepository } from "./GitHubRepository";
import { sortEvento } from "../evento/sortEventos";

export async function updateDataToGitHub (app: IApp) {
  console.log("Salvando no git...");
  const githubRepo = new GitHubRepository(
    app.git.owner,
    app.git.repo,
    app.git.token
  );

  const res = await githubRepo.getContentData(app.git.path);
  if (res?.content) {
    const data = {
      eventos: {
        items: app.eventos.items,
      },
    };
    if (data.eventos.items.length) {
      try {
        const result = await githubRepo.commitFile(
          app.git.path,
          JSON.stringify(data, null, 2)
        );
        if (result && result.ok) {
          console.log(
              `GIT: Dados atualizados (${data.eventos.items.length}) no Git com status ${result.status}`
          );
        }
      } catch (error) {
        console.log("Erro ao salvar no git: ", error);
      }
    }
  }
}

export async function startGIT (app: IApp) {
  if (!app.git.token || !app.git.owner) return;
  console.log("MODULO: Git iniciado!");

  watchEffect(async () => {
    app.eventos.items.map((e) => [e.gid, e.desc, e.list, e.locale, e.title]);
    sortEvento(app);
    await updateDataToGitHub(app);
  });
}
