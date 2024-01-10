import * as sockets from "../../infra/socket";
import * as eventos from "../Eventos";
import { Evento } from "@prisma/client";
import { actions } from "./Agenda";
import { config } from "../../config";

console.log("Google Agenda iniciado!");

sockets.onConnection(async (socket) => {
  socket.on("reload", async () => {
    console.log("Reload data google!");
    await sync();
  });
});

sockets.server.on("add", async (e: Evento) => {
  try {
    if (e.gid?.trim() === "") {
      e.gid = (await actions.createEventGoogle(e)).gid;
      console.log("Criado na agenda: ", e);
    } else {
      e.gid = (await actions.updateEventGoogle(e)).gid;
      console.log("Atualizado na agenda: ", e);
    }
    await eventos.save(e);
    if (e.recurring?.trim() !== "") {
      await sync();
    }
    sockets.io.sockets.emit("eventos", await eventos.all());
  } catch (error) {
    console.log("Erro ao adicionar evento no google agenda: ", e, error);
  }
});

sockets.server.on("removed", async (e: Evento) => {
  try {
    await actions.deleteEventGoogle(e);
    sockets.io.sockets.emit("eventos", await eventos.all());
  } catch (error) {
    console.log("Erro ao remover o evento da agenda: ", e);
  }
});

sockets.server.on("updated", async (data: Evento[]) => {
  console.log("Atualizar eventos no google agenda: ", data.length);
});

/**
 * Remover eventos...
 */
export async function removeEvents(date1: Date, date2: Date) {
  const events = await actions.getEventGoogle(date1, date2);
  const filtered = events.filter(
    (e) => true || (e.locale && e.locale?.includes("SÃO PEDRO"))
  );
  for (const event of filtered) {
    try {
      console.log("Removendo evento: ", event);

      await actions.deleteEventGoogle(event);
    } catch (error) {
      console.log("Erro ao remover eventos: ", event.title, event.locale);
    }
  }
}

/**
 * Baixar eventos do Google agenda
 */
async function sync() {
  const data = await eventos.all();
  const googleEvents = await actions.getEventGoogle(
    config.dateFirst,
    config.dateLast
  );
  console.log("Itens do google encontrados: ", googleEvents.length);

  // Atualizar do google agenda para local!
  for (const googleEvent of googleEvents) {
    const item = data.find((e) => e.gid === googleEvent.gid);
    if (item) {
      googleEvent.id = item.id;
    }
    await eventos.save(googleEvent);
  }

  // Remover eventos locais que foram removidos no google agenda
  for (const e of data) {
    const item = googleEvents.find((event) => event.gid === e.gid);
    if (!item) {
      console.log(
        "Evento foi removido do google e será removido localmente: ",
        e
      );
      // await eventos.remove(e.id);
    }
  }
  sockets.io.sockets.emit("eventos", await eventos.all());
}

sync();
