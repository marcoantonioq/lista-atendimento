const res = await fetch("/data/titles", {
  method: "GET",
  headers: {
    "Content-Type": "application/text",
  },
});

export const titles = (await res.text())
  .split("\n")
  .map((e) => e.trim().toUpperCase());
