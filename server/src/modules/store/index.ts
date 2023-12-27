import * as sockets from "../../infra/socket";
import * as eventos from "../Eventos";
import { Evento } from "@prisma/client";

console.log("Store iniciado!");

sockets.onConnection(async (socket) => {
  sockets.io.emit("eventos", await eventos.all());

  socket.on("save", async (e: Evento) => {
    const event = await eventos.save(e);
    const updated = await eventos.all();
    setTimeout(() => {
      sockets.server.emit("add", event);
      sockets.server.emit("updated", updated);
    }, 100);
    sockets.io.emit("eventos", updated);
  });

  socket.on("remove", async (e: Evento) => {
    await eventos.remove(e.id);
    const updated = await eventos.all();
    setTimeout(() => {
      sockets.server.emit("removed", e);
      sockets.server.emit("updated", updated);
    }, 100);
    sockets.io.emit("eventos", updated);
  });

  socket.on("all", async (call: (e: Evento[]) => void) => {
    call(await eventos.all());
  });
});
