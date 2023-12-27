import { computed, reactive } from "vue";
import { app } from "./app";

interface Item {
  list: string;
  title: string;
  date: {
    dd: string;
    m: string;
    hh: string;
    mm: string;
    s: string;
  };
  locale: string;
  desc: string;
  id: string;
  eid: string;
  url: string;
}

interface Payload {
  itens: Item[];
  lists: string[];
  titles: string[];
  filter: string;
}

export const data = reactive<Payload>({
  itens: [],
  lists: [],
  titles: [],
  filter: "",
});

export async function syncData() {
  const res = await fetch("/data/data.json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = res.json();
  return data;
}

export const diaSemana = (date?: Date) => {
  if (!date) return "";
  const semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return semana[date.getDay()] || "";
};

export const dia = (date?: Date) => {
  if (!date) return "";
  return String(date.getDate() || "").padStart(2, "0");
};
export const mes = (date?: Date) => {
  if (!date) return "";
  return String(date.getMonth() + 1 || "").padStart(2, "0");
};

export const diaMes = (date?: Date) => {
  if (!date) return "";
  return `${dia(date)}/${mes(date)}`;
};

export const hora = (date?: Date) => {
  if (!date) return "";
  const hours = String(date.getHours() || "").padStart(2, "0");
  const min = String(date.getMinutes() || "").padStart(2, "0");
  return `${hours}:${min}`;
};

export const getUrl = (el: Item) => {
  return `https://calendar.google.com/calendar/r/eventedit/${el.eid}`;
};

export const updateFetched = (text: string) => {
  data.filter = text;
};

export const clickRow = (row: Item) => {
  window.open(row.url, "_blank");
};

export const filtered = computed(() => {
  const values: Payload = {
    itens: [],
    lists: [],
    titles: [],
    filter: data.filter.toLocaleLowerCase().trim(),
  };
  if (values.filter === "") {
    values.itens = data.itens;
    values.titles = data.titles;
    values.lists = data.lists;
  } else {
    values.itens = data.itens.filter((itens) =>
      Object.values(itens).join(", ").toLowerCase().includes(values.filter)
    );
    values.titles.slice(0, 0);
    values.lists.slice(0, 0);
    values.itens.forEach((el: Item) => {
      if (!values.titles.includes(el.title)) {
        values.titles.push(el.title);
      }
      if (!values.lists.includes(el.list)) {
        values.lists.push(el.list);
      }
      return el;
    });
  }

  return values;
});

export async function updateData() {
  let values: string[][] = [];
  const semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const path = `${app.BASE_URL}/data/lista.json`;

  try {
    const response = await fetch(
      `${path}?v=${new Date().toISOString().replace(/\D/g, "")}`
    );
    values = (await response.json()).values;

    data.itens = values
      .filter((el: string[]) => el[2] === "" || new Date(el[2]) >= new Date())
      .map((el: string[]): Item => {
        const date = new Date(el[2]);
        const dd = String(date.getDate() || "").padStart(2, "0");
        const m = String(date.getMonth() + 1 || "").padStart(2, "0");
        const hh = String(date.getHours() || "").padStart(2, "0");
        const mm = String(date.getMinutes() || "").padStart(2, "0");
        const s = semana[date.getDay()] || "";
        return {
          list: el[0],
          title: el[1],
          date: { dd, m, hh, mm, s },
          locale: el[3],
          desc: el[4],
          id: el[5],
          eid: el[6],
          url: `https://calendar.google.com/calendar/r/eventedit/${el[6]}`,
        };
      })
      .map((el: Item) => {
        if (!data.titles.includes(el.title)) {
          data.titles.push(el.title);
        }
        if (!data.lists.includes(el.list)) {
          data.lists.push(el.list);
        }
        return el;
      });

    if (data.itens.length) {
      localStorage.setItem("itens", JSON.stringify(data.itens));
    }
  } catch (error) {
    console.error("Erro ao coletar e atualizar dados:", error);
  }
}

try {
  data.itens = JSON.parse(localStorage.getItem("itens") || "[]");
} catch (info) {
  console.info(info);
}

// updateData();

export default data;
