import { Server, Socket } from "socket.io";
import * as http from "http";

import { config } from "../../config";

export const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Servidor ok!");
});

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(config.port, () => {
  console.log(`Socket.IO iniciado na porta ${config.port}`);
});

export function onConnection(call: (socket: Socket) => void) {
  io.on("connection", async (socket: Socket) => {
    if (socket.handshake.auth.token !== config.token) {
      console.log("Cliente com token inválido desconectado!!!");
      socket.disconnect();
      return;
    }
    call(socket);
  });
}
