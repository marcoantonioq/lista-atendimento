/* eslint-disable @typescript-eslint/no-explicit-any */
import { Evento } from "./Eventos";

export class APP {
  public readonly BASE_URL = "https://faina.ccbgo.org.br";
  public isAdmin = !!localStorage.getItem("key");
  public focus = true;
  public loading = false;
  public shareable = !!navigator.share;

  public eventos = [] as Evento[];

  constructor(
    public title = "APP",
    public titles: string[] = [],
    public settings = {
      server: "",
      sound: false,
      notification: false,
      token: "",
    }
  ) {}

  /**
   * Utils
   */
  openWindow(url: string) {
    window.open(url, "CCB", "width=1000,height=700,left=10,top=10");
  }

  shared() {
    const { hash, origin, href } = window.location;
    const url = hash.includes("#lista?filter=REGIONAL") ? origin : href;
    navigator
      .share({
        title: "Lista de Atendimentos",
        text: "Lista de atendimento e diversos",
        url,
      })
      .then(() => console.log("Compartilhado com sucesso"))
      .catch((error) => console.error("Erro ao compartilhar:", error));
  }
}
