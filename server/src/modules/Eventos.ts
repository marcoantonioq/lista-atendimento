import { PrismaClient, Evento } from "@prisma/client";
import { log } from "../util/Log";
import { config } from "../config";

const prisma = new PrismaClient();
let titles = [] as string[];

export async function save(data: Evento): Promise<Evento> {
  const { id, ...event } = data;

  try {
    const result = await prisma.evento.upsert({
      where: { id },
      update: { ...event },
      create: { ...event },
    });
    return result;
  } catch (error) {
    const msg = `Erro ao atualizar evento: ${error}`;
    log(msg);
    throw msg;
  }
}

// Função para ler um evento por ID
export async function byId(eventId: number): Promise<Evento | null> {
  try {
    const event = await prisma.evento.findUnique({
      where: {
        id: eventId,
      },
    });
    return event;
  } catch (error) {
    throw new Error(`Erro ao buscar evento por ID: ${error}`);
  }
}

// Função para listar todos os eventos
export async function all(): Promise<Evento[]> {
  try {
    const events = await prisma.evento.findMany({
      where: {
        end: {
          gte: config.dateFirst,
          lte: config.dateLast,
        },
      },
    });
    return sort(events);
  } catch (error) {
    const msg = `Erro ao buscar todos os eventos: ${error}`;
    log(msg);
    return [];
  }
}

// Função para deletar um evento por ID
export async function remove(eventId: number): Promise<Evento> {
  try {
    const deletedEvent = await prisma.evento.delete({
      where: {
        id: eventId,
      },
    });
    return deletedEvent;
  } catch (error) {
    throw new Error(`Erro ao deletar evento: ${error}`);
  }
}

export function sort(eventos: Evento[]): Evento[] {
  eventos.sort((a, b) => {
    const titleA = titles.indexOf(a.title?.toUpperCase() || "");
    const titleB = titles.indexOf(b.title?.toUpperCase() || "");

    if (titleA !== titleB) {
      return titleA - titleB;
    }

    if (b.date && a.date && b.date.getTime() !== a.date.getTime()) {
      return a.date.getTime() - b.date.getTime();
    }

    if (a.locale && b.locale) {
      return a.locale.localeCompare(b.locale);
    }

    return 0;
  });
  return eventos;
}

async function fetchText(path: string): Promise<string[]> {
  const res = await fetch(`https://ccbfaina.github.io/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/text",
    },
  });

  return (await res.text()).split("\n").map((e) => e.trim().toUpperCase());
}

(async () => {
  titles = await fetchText("data/titles");
})();
