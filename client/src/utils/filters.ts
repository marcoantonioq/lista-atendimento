import { Evento } from "../App";

function normalizeString(str: string): string {
  return str
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function includesNormalized(mainStr: string, subStr: string): boolean {
  return normalizeString(mainStr).includes(normalizeString(subStr));
}

function filterByList(event: Evento, lista: string): boolean {
  if (!lista) return true;
  console.log("Definido o filtro por local: ", lista);
  return includesNormalized(event.list, lista);
}

function filterByLocale(event: Evento, locale: string): boolean {
  if (!locale) return true;
  console.log("Definido o filtro por local: ", locale);
  return includesNormalized(event.locale, locale);
}

function filterByText(event: Evento, filter: string): boolean {
  if (!filter) return true;

  const text =
    event.date?.toLocaleDateString() +
    " " +
    event.title +
    " " +
    event.list +
    " " +
    event.locale +
    " " +
    event.desc;

  const filterNFD = normalizeString(filter);
  return filterNFD.split(" ").every((e) => includesNormalized(text, e));
}

export function groupByProperty(
  eventos: Evento[],
  property: keyof Evento,
  lista = "",
  filter = "",
  locale = ""
): { [key: string]: Evento[] } {
  const groupedEvents: { [key: string]: Evento[] } = {};

  eventos.forEach((event) => {
    if (
      !filterByList(event, lista) ||
      !filterByLocale(event, locale) ||
      !filterByText(event, filter)
    ) {
      return;
    }

    const key = event[property] as string;
    if (!(key in groupedEvents)) {
      groupedEvents[key] = [];
    }
    groupedEvents[key].push(event);
  });

  return groupedEvents;
}

export function filterText(list: string[], word: string, limit = 4): string[] {
  const normalizedWord = normalizeString(word);

  return list
    .filter((e) =>
      normalizeString(e)
        .split(" ")
        .every((s) => includesNormalized(normalizedWord, s))
    )
    .slice(0, limit);
}
