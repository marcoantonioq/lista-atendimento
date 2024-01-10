const res = await fetch("/data/locales", {
  method: "GET",
  headers: {
    "Content-Type": "application/text",
  },
});

export const locales = (await res.text()).split("\n").map((e) => e.trim());
