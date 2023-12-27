import { calendar_v3, google } from "googleapis";
import * as fs from "fs";
import { Evento } from "@prisma/client";

interface DateRange {
  dateFirst: Date;
  dateLast: Date;
}

const agendas = {
  REGIONAL:
    "47cafc18f2792c5710809aae573052af940ed0b8d6a65dc2527f2c0063460c6a@group.calendar.google.com",
  DARPE:
    "bd73b8fdc0f89f33391898c396cc90507ac870d22e56cbac1177ba770d052e2f@group.calendar.google.com",
  LOCALIDADES:
    "3e3188ab2f3260759a6d8c82b77bdd769824b3516f39a2078c0d66bb1f398425@group.calendar.google.com",
  RPC: "475e6273639473791b28e6939abb3d5a8ca06be0d6a8de22a5eb2f29465d98e3@group.calendar.google.com",
  PORTEIROS:
    "a7f70358167561eeca994d7c598d96337173f576e85de8fe5cb86494a1c579c5@group.calendar.google.com",
};

const credentials = JSON.parse(
  fs.readFileSync("src/config/secret.json", "utf-8")
);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

export const actions = {
  async updateEventGoogle(event: Evento) {
    const calendarId =
      agendas[event.list.toUpperCase() as keyof typeof agendas] ||
      agendas.REGIONAL;

    const { data } = await calendar.events.update({
      calendarId,
      eventId: String(event.gid),
      requestBody: {
        summary: event.title,
        location: event.locale,
        description: event.desc,
        end: { dateTime: event.end.toISOString() },
        start: { dateTime: event.date.toISOString() },
      },
    });
    return actions.toPDO(data);
  },
  async deleteEventGoogle(event: Evento) {
    const calendarId =
      agendas[event.list.toUpperCase() as keyof typeof agendas] ||
      agendas.REGIONAL;
    await calendar.events.delete({
      calendarId,
      eventId: String(event.gid),
    });
  },
  async createEventGoogle(event: Evento) {
    const calendarId =
      agendas[event.list.toUpperCase() as keyof typeof agendas] ||
      agendas.REGIONAL;
    const start = event.date.toISOString();
    const end = event.end?.toISOString() || start;

    const payload: calendar_v3.Params$Resource$Events$Insert = {
      calendarId,
      requestBody: {
        summary: event.title,
        location: event.locale,
        description: event.desc,
        start: {
          dateTime: start,
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: end,
          timeZone: "America/Sao_Paulo",
        },
      },
    };

    if (
      event.recurring &&
      payload.requestBody &&
      event.recurring?.trim() !== ""
    ) {
      payload.requestBody.recurrence = [];
      payload.requestBody?.recurrence?.push(event.recurring);
      console.log("Evento com recorrência: ", event, payload);
    }

    const { data } = await calendar.events.insert(payload);
    return actions.toPDO(data);
  },
  async getEventGoogle(startDate: Date, endDate: Date) {
    const startDateCopy = new Date(startDate);
    const endDateCopy = new Date(endDate);
    startDateCopy.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDateCopy.setDate(endDateCopy.getDate() + 1);
    endDateCopy.setHours(0, 0, 0, 0);

    const googleEvents: Evento[] = [];
    for (const [agenda, calendarId] of Object.entries(agendas)) {
      const response = await calendar.events.list({
        calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
      });

      response.data.items?.map(actions.toPDO).map((e) => {
        googleEvents.push(e);
      });
    }
    return googleEvents;
  },
  getDateBetween(eventos: Evento[]): DateRange {
    const defaultDateRange: DateRange = {
      dateFirst: new Date(),
      dateLast: new Date(),
    };

    return eventos.reduce((acc: DateRange, e) => {
      if (e.date) {
        acc.dateFirst =
          !acc.dateFirst || e.date < acc.dateFirst ? e.date : acc.dateFirst;
        acc.dateLast =
          !acc.dateLast || e.date > acc.dateLast ? e.date : acc.dateLast;
      }
      return acc;
    }, defaultDateRange);
  },
  toPDO(e: calendar_v3.Schema$Event): Evento {
    return <Evento>{
      id: 0,
      list: e.organizer?.displayName,
      title: e.summary,
      locale: e.location,
      desc: e.description,
      date: e.start?.dateTime ? new Date(e.start?.dateTime) : undefined,
      end: e.end?.dateTime ? new Date(e.end?.dateTime) : undefined,
      updated: e.updated ? new Date(e.updated) : undefined,
      gid: e.id,
      maps: e.htmlLink?.replace(/.*eid=/, ""),
      recurring: `${!!e.recurringEventId}`,
    };
  },
};

export async function syncWithGoogleCalendar(data: Evento[]) {
  const updatedEvents: Evento[] = [];

  try {
    const { dateFirst, dateLast } = actions.getDateBetween(data);
    const googleEvents = await actions.getEventGoogle(dateFirst, dateLast);

    // Eventos existentes no google agenda e não localmente!
    googleEvents
      .filter(
        (googleEvent) =>
          !data.find(
            (e) =>
              e.gid === googleEvent.gid ||
              (e.title === googleEvent.title &&
                e.locale === googleEvent.locale &&
                e.date.toISOString() === googleEvent.date.toISOString())
          )
      )
      .forEach((e) => {
        updatedEvents.push(e);
      });

    for (const event of data.filter((e) => e.end && e.end > new Date())) {
      const googleEvent = googleEvents.find(
        (e) =>
          e.gid === event.gid ||
          (e.list === event.list &&
            e.title === event.title &&
            e.locale === event.locale &&
            e.date.toISOString() === event.date.toISOString())
      );

      try {
        if (
          googleEvent &&
          event.gid !== googleEvent.gid &&
          event.gid?.trim() !== ""
        ) {
          // Alterado de lista!
          try {
            actions.deleteEventGoogle(event);
          } catch (error) {
            error;
          }
          const e = await actions.createEventGoogle(event);
          e.id = event.id;
          updatedEvents.push(e);
          console.log("Evento alterador de lista: ", event);
        } else if (!googleEvent) {
          const e = await actions.createEventGoogle(event);
          e.id = event.id;
          if (data) updatedEvents.push(e);
          console.log("Criado no google agenda: ", e);
        } else if (
          googleEvent.updated &&
          event.updated &&
          googleEvent.updated.getTime() > event.updated.getTime()
        ) {
          console.log("Google mais recente, atualizar local: ", googleEvent);
          googleEvent.id = event.id;
          updatedEvents.push(googleEvent);
          const index = data.findIndex((e) => e.gid === event.gid);
          if (index !== -1) {
            data[index] = googleEvent;
          }
        } else if (
          googleEvent.updated &&
          event.updated &&
          googleEvent.updated.getTime() < event.updated.getTime()
        ) {
          console.log("Local mais recente, atualizar no google: ", event);
          updatedEvents.push(event);
          event.id = googleEvent.id;
          await actions.updateEventGoogle(event);
        } else {
          // console.log("Arquivos são o mesmo!!!", event);
        }
      } catch (error) {
        console.log("Erro ao atualizar objeto: ", error);
      }
    }
    return updatedEvents;
  } catch (error) {
    console.error("Erro ao sincronizar:", error);
  }
}

// (async () => {
//   try {
//     const data: any[] = JSON.parse(
//       fs.readFileSync("src/google/data.json", "utf-8") || "[]"
//     );
//     console.log("Iniciando processamento...", new Date());

//     const result = await syncWithGoogleCalendar(data);
//     fs.writeFileSync("src/google/data.json", JSON.stringify(result), "utf-8");
//     console.log(
//       "Sincronização concluída e dados salvos com sucesso.",
//       new Date()
//     );
//   } catch (error) {
//     console.error("Ocorreu um erro durante a sincronização:", error);
//   }
// })();
