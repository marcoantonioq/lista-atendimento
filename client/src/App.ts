/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket, io } from "socket.io-client";
import { reactive } from "vue";

export interface Evento {
  id: number;
  list: string;
  title: string;
  locale: string;
  desc: string;
  date?: Date;
  end?: Date;
  gid?: string;
  updated?: Date;
  recurring?: string;
  maps?: string;
}

class EventoService {
  private socket: Socket | null = null;
  public state = reactive({
    eventos: [] as Evento[],
    focus: true,
    isAdmin: false,
    loading: false,
    connected: false,
    shareable: !!navigator.share,
  });

  constructor(private server: string, private token: string) {
    if (token) {
      this.connectSocket();
      this.state.isAdmin = true;
    } else {
      this.loadEvents();
    }
  }

  private connectSocket(): void {
    this.socket = io(this.server.trim(), {
      auth: {
        token: this.token,
      },
    });

    this.socket.on("eventos", (eventos: Evento[]) => {
      this.updateEventos(eventos);
    });

    this.socket.on("connect", () => {
      console.log("Conectado no servidor socket!");
      this.state.connected = true;
      this.state.isAdmin = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado do servidor socket!");
      this.state.connected = false;
      this.state.isAdmin = false;
    });
  }

  private updateEventos(updated: Evento[]): void {
    this.state.eventos = updated.map((e: Evento) => ({
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
    }));
  }

  public async loadEvents(): Promise<void> {
    try {
      const url = `/data/data.json?v=${new Date()
        .toISOString()
        .replace(/\D/g, "")}`;
      const response = await fetch(url);

      if (response.ok) {
        const events = await response.json();
        this.updateEventos(events);
      } else {
        console.error("Erro ao carregar dados do servidor:", response.status);
      }
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    }
  }

  public saveEvent(evento: Evento): void {
    this.socket?.emit("save", evento);
  }

  public removeEvent(evento: Evento): void {
    this.socket?.emit("remove", evento);
  }
}

export const app = new EventoService(
  localStorage.getItem("ip_socket") || "",
  localStorage.getItem("key") || ""
);
