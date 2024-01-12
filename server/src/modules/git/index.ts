import { config } from "../../config";
import * as sockets from "../../infra/http";
import { GitHubRepository } from "../../util/GitHubRepository";
import * as eventos from "../Eventos";
import { Evento } from "@prisma/client";

console.log("Git iniciado!");
const githubRepo = new GitHubRepository(
  "ccbfaina",
  "ccbfaina.github.io",
  config.token
);

sockets.onConnection(async (socket) => {
  socket.on("reload", async () => {
    console.log("Reload data git!");
    updateDataToGitHub();
  });
});

sockets.server.on("add", async (e: Evento) => {
  updateDataToGitHub();
  console.log("Salvar no git: ", e);
});

sockets.server.on("removed", async (e: Evento) => {
  updateDataToGitHub();
  console.log("Remover no git: ", e);
});

sockets.server.on("updated", async (events: Evento[]) => {
  console.log("Atualizar eventos no git: ", events.length);
});

async function updateDataToGitHub() {
  const res = await githubRepo.getContentData("data/data.json");
  if (res?.content) {
    const events = await eventos.all();
    console.log("Eventos atualizados no git: ", events.length);

    if (events.length) {
      const result = await githubRepo.commitFile(
        "data/data.json",
        JSON.stringify(events)
      );
      if (result && result.ok) {
        console.log(
          `Dados atualizados (${events.length}) no Git com status ${result.status}`
        );
      }
    }
  }
}
