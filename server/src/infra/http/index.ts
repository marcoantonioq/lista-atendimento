import { Server, Socket } from "socket.io";
import http from "http";
import path from "path";
import fs from "fs/promises";
import { config } from "../../config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const setting = {
  path: path.join("src", "config", "config.json"),
  token: "",
  async read() {
    try {
      const newSetting = JSON.parse(await fs.readFile(this.path, "utf-8"));
      Object.assign(setting, newSetting);
    } catch (error) {
      await this.save();
    }
  },
  async save() {
    await fs.writeFile(this.path, JSON.stringify(setting, null, 2));
  },
};
setting.read();

const app = express();
app.use(bodyParser.json());
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.resolve(__dirname, "web")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "web/index.html"));
});

app.get("/settings", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "web/settings.html"));
});

app.get("/api/data", (req: Request, res: Response) => {
  res.status(200).json({
    token: !!setting.token,
  });
});

app.post("/api/settings", async (req: Request, res: Response) => {
  const payload = {
    message: "",
    data: "",
  };
  const { oldToken, token } = req.body;
  if (setting.token === oldToken) {
    setting.token = token;
    await setting.save();
    payload.message = `Configurações alteradas com sucesso!`;
  } else {
    payload.message = "Token anterior inválido!";
    // res.status(400).json(payload);
  }
  res.status(200).json(payload);
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ mensagem: "Resposta do endpoint /api" });
});

server.listen(config.port, () => {
  console.log(`Socket.IO iniciado na porta ${config.port}`);
});

io.on("connection", async (socket: Socket) => {
  if (socket.handshake.auth.token !== config.token) {
    console.log("Cliente com token inválido desconectado!!!");
    socket.disconnect();
    return;
  }
  console.log("Cliente conectado:", socket.id);
});

export function onConnection(call: (socket: Socket) => void) {
  io.on("connection", async (socket) => {
    if (socket.handshake.auth.token !== config.token) {
      console.log("Cliente com token inválido desconectado!!!");
      socket.disconnect();
      return;
    }
    call(socket);
  });
}

export default server;
