import { IApp } from "../../app";
import { salvarStore } from "../localstore";
import { GoogleCalendarManager } from "./Agenda";
import { GoogleSheetManager } from "./Sheet";

let dateFirst = new Date(new Date().getTime() - 60 * 60 * 1000);
let dateLast = new Date(new Date().getTime() + 80 * 24 * 60 * 60 * 1000);
const calendar = GoogleCalendarManager.getInstance();
const sheet = GoogleSheetManager.getInstance();

export async function googleSync(intervaloDias: number) {
  console.log("Buscando atualizações no google...");
  dateFirst = new Date(new Date().getTime() - 60 * 60 * 1000);
  dateLast = new Date(
    new Date().getTime() + intervaloDias * 24 * 60 * 60 * 1000
  );
  return await calendar.getEventGoogle(dateFirst, dateLast);
}

async function saveDataStore(app: IApp) {
  app.eventos.items = await googleSync(app.eventos.intervaloDias);
  salvarStore(app);
  console.log("Dados para salvar no google sheet: ", app.eventos.items.length)
  // sheet.updateSheetData("13sjbh4fRi_CiSET4ARbZA3S4pTugDTEOTYMWy8YGr4w", "Lista", [app.eventos.items])
}

export async function startGOOGLE(app: IApp) {
  if (!app.google.secret.client_email) return;
  console.log("MODULO: Google Agenda...");
  try {
    calendar.reAuth(app.google.secret);
    await calendar.managerCalendars(app.google.calendars);
    app.google.calendars = calendar.calendars;
    app.eventos.items = await googleSync(app.eventos.intervaloDias);

    await saveDataStore(app);

    setInterval(async () => {
      await saveDataStore(app);
    }, 24 * 60 * 60 * 1000);

  } catch (error) {
    console.log("Erro ao iniciar o Google Agenda: ", error);
  }
}
