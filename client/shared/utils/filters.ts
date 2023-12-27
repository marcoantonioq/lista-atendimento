import { Evento } from "../app/Eventos";

export function groupByProperty(
  eventos: Evento[],
  property: keyof Evento,
  filter = ""
): {
  [key: string]: Evento[];
} {
  const groupedEvents: { [key: string]: Evento[] } = {};
  const filterNFD = filter
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  eventos.forEach((event) => {
    const text = (
      event.date?.toLocaleDateString() +
      " " +
      event.title +
      " " +
      event.list +
      " " +
      event.locale +
      " " +
      event.desc
    )
      .toUpperCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

    const valid = filterNFD.split(" ").every((e) => text.includes(e));

    if (!valid) return;
    const isCidade =
      filterNFD.match(/\w+ -/i) &&
      !event.locale
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .match(new RegExp(`^${filterNFD.trim()}`));
    if (isCidade) {
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

export function filterText(list: string[], word: string, limit = 4) {
  return list
    .filter((e) =>
      word
        .toUpperCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .split(" ")
        .every((s) => {
          return e
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toUpperCase()
            .includes(s);
        })
    )
    .filter((_el, id) => id < limit);
}
