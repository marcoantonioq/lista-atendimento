const res = await fetch("/data/desc", {
  method: "GET",
  headers: {
    "Content-Type": "application/text",
  },
});

export const description = (await res.text()).split("\n").map((e) => e.trim());
