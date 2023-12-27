import { APP } from "../../shared/app/APP";
import { titles as titlesEventos } from "../../shared/app/Titles";
import { Evento } from "../../shared/app/Eventos";
import { reactive } from "vue";
import { Socket, io } from "socket.io-client";

export const app = <APP>reactive(new APP("APP", titlesEventos));

export let socket: Socket | null = null;

const settings = {
  fetch: {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  },
};

export function saveEvent(evento: Evento) {
  socket?.emit("save", evento);
}

export function removeEvent(evento: Evento) {
  socket?.emit("remove", evento);
}

function load(updated: Evento[]) {
  app.eventos = [];
  updated.forEach((e: Evento) => {
    app.eventos.push({
      id: e.id,
      list: e.list || "",
      title: e.title || "",
      locale: e.locale || "",
      desc: e.desc || "",
      date: e.date ? new Date(e.date) : undefined,
      end: e.end ? new Date(e.end) : undefined,
      updated: e.updated ? new Date(e.updated) : undefined,
      gid: e.gid,
      maps: e.maps,
      recurring: e.recurring,
    });
  });
}

fetch(`/data/database.json`, settings.fetch);

export function reloadData() {
  if (app.loading) return;
  app.loading = true;
  setTimeout(() => {
    app.loading = false;
  }, 5000);
  console.log("Recarregar dados!!!");
  socket?.emit("reload");
}

if (app.isAdmin && navigator.onLine) {
  const token = localStorage.getItem("key") || "";
  const server = localStorage.getItem("ip_socket") || "";
  socket = io(server.trim(), {
    auth: {
      token,
    },
  });

  socket.on("eventos", (eventos: Evento[]) => {
    console.log(
      `Eventos recebidos via socket: ${JSON.stringify(eventos.length, null, 2)}`
    );
    load(eventos);
  });

  app.isAdmin = false;
  socket.on("connect", () => {
    console.log("Conectado no servidor socket! ");
    app.isAdmin = true;
  });

  socket.on("disconnect", () => {
    console.log("Desconectado do servidor socket! ");
    app.isAdmin = false;
  });
} else {
  const fetchEvents = async (url: string) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Erro ao baixar ${url}:`, error);
    }
    return null;
  };

  const loadEvents = async (): Promise<void> => {
    try {
      const events =
        (await fetchEvents(
          `/data/data.json?v=${new Date().toISOString().replace(/\D/g, "")}`
        )) || (await fetchEvents("/data/data.json"));

      if (events) {
        load(events);
      } else {
        console.error("Erro ao carregar dados de cache: ");
      }
    } catch (error) {
      console.error("Erro ao carregar os dados: ", error);
    }
  };

  loadEvents();
}
