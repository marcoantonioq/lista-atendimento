export function openWindow(url: string) {
  window.open(url, "CCB", "width=1000,height=700,left=10,top=10");
}

export const shared = () => {
  const { hash, origin, href } = window.location;
  const url = hash.includes("#lista?filter=REGIONAL") ? origin : href;
  navigator
    .share({
      title: "CCB",
      text: "Lista de atendimento e diversos ",
      url,
    })
    .then(() => console.log("Compartilhado com sucesso"))
    .catch((error) => console.error("Erro ao compartilhar:", error));
};
