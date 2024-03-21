import { IApp } from "../../app";
import { GoogleCalendarManager } from "./Agenda";

let dateFirst = new Date(new Date().getTime() - 60 * 60 * 1000);
let dateLast = new Date(
  new Date().getTime() + 80 * 24 * 60 * 60 * 1000
);
const calendar = GoogleCalendarManager.getInstance();

export async function googleSync (intervaloDias: number) {
  console.log("Buscando atualizações no google...");
  dateFirst = new Date(new Date().getTime() - 60 * 60 * 1000);
  dateLast = new Date(
    new Date().getTime() + intervaloDias * 24 * 60 * 60 * 1000
  );
  return await calendar.getEventGoogle(dateFirst, dateLast);
}

export async function startGOOGLE (app: IApp) {
  if (!app.google.secret.client_email) return;
  console.log("MODULO: Google Agenda...");
  try {
    calendar.reAuth(app.google.secret);
    await calendar.managerCalendars(app.google.calendars);
    app.google.calendars = calendar.calendars;
    app.eventos.items = await googleSync(app.eventos.intervaloDias);

    setInterval(async () => {
      app.eventos.items = await googleSync(app.eventos.intervaloDias);
    }, 24 * 60 * 60 * 1000);
  } catch (error) {
    console.log("Erro ao iniciar o Google Agenda: ", error);
  }
}
