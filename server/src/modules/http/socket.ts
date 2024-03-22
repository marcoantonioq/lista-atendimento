import { Server, Socket } from "socket.io";
import { IApp, IEvento } from "../../app";
import { GoogleCalendarManager } from "../google/Agenda";
import { sortEvento } from "../evento/sortEventos";
import { updateApp } from "../../helpers/updateApp";
import { restartApp } from "../../helpers/restartApp";
import { googleSync } from "../google";
import { salvarStore } from "../localstore";

const APP = {
  APP: "app",
  APP_SAVE: "saveApp",
  CONNECT: "connection",
  MESSAGE: "message",
  ERROR: "error",
  EVENTOS: "eventos",
  SAVE: "save",
  REMOVE: "remove",
  RELOAD: "reload",
  REBOOT: "reboot",
};

const calendar = GoogleCalendarManager.getInstance();

export function setupSocketIO(io: Server, app: IApp): void {
  io.on(APP.CONNECT, async (socket: Socket) => {
    const { token } = socket.handshake.auth;

    try {
      if (token !== app.system.token) {
        throw new Error("Cliente com token inválido!");
      }
    } catch (error) {
      const msg = `Erro Socket.IO:: ${error}`;
      console.log("Socket: ", msg);
      io.emit(APP.ERROR, { msg });
      socket.disconnect();
      return;
    }

    try {
      const handleSaveEvent = async (
        evento: IEvento,
        callback: (evento: IEvento) => void
      ) => {
        try {
          const savedEvent = await calendar.updateOrCreateEvent(evento);
          app.eventos.items = app.eventos.items.filter(
            (e) => e.gid !== evento.gid
          );
          app.eventos.items.push(savedEvent);
          sortEvento(app);
          if (evento.recurring && !evento.gid) {
            await handleReload(app);
          } else {
            io.emit(APP.EVENTOS, app.eventos.items);
          }
          console.log("Evento salvo no Google:", savedEvent);
          callback(savedEvent);
          salvarStore(app);
        } catch (error) {
          handleEventError("Erro ao salvar evento", String(error), io);
        }
      };

      const handleRemoveEvent = async (
        evento: IEvento,
        callback: (evento: IEvento) => void
      ) => {
        try {
          try {
            const removedEvent = await calendar.deleteEvent(evento);
            app.eventos.items = app.eventos.items.filter(
              (e) => e.gid !== evento.gid
            );
            io.emit(APP.EVENTOS, app.eventos.items);
            callback(removedEvent);
            salvarStore(app);
            console.log("Evento removido no Google:", removedEvent);
          } catch (error) {
            console.log("Evento não existe no Google!");
          }
          io.emit(APP.APP, app);
        } catch (error) {
          handleEventError("Erro ao remover evento", String(error), io);
        }
      };

      const handleAppSave = async (
        newApp: IApp,
        callback: (app: IApp) => void
      ) => {
        try {
          updateApp(app, newApp);
          salvarStore(app);
          callback(app);
          io.emit(APP.APP, app);
        } catch (error) {
          handleEventError("Erro ao salvar aplicativo", String(error), io);
        }
      };

      const handleAppReboot = async () => {
        try {
          await handleReboot(app);
        } catch (error) {
          handleEventError("Erro ao reiniciar aplicativo", String(error), io);
        }
      };

      const handleReload = async (app: IApp): Promise<void> => {
        console.log("Recarregando...");
        app.eventos.items = await googleSync(app.eventos.intervaloDias);
        sortEvento(app);
        io.emit(APP.EVENTOS, app.eventos.items);
        console.log("Terminou de recarregar...");
      };

      const handleReboot = async (app: IApp): Promise<void> => {
        console.log("Reiniciando aplicativo...");
        app.system.rebooting = true;
        restartApp();
      };

      const handleEventError = (
        message: string,
        error: string,
        io: Server
      ): void => {
        const msg = `${message}: ${error}`;
        io.emit(APP.ERROR, { msg });
      };

      socket.emit(APP.APP, app);
      socket.on(APP.SAVE, handleSaveEvent);
      socket.on(APP.REMOVE, handleRemoveEvent);
      socket.on(APP.RELOAD, () => handleReload(app));
      socket.on(APP.APP_SAVE, handleAppSave);
      socket.on(APP.REBOOT, handleAppReboot);
      socket.emit(APP.MESSAGE, "Conectado");
      console.log("Cliente conectado:", socket.id);
    } catch (error) {
      const msg = `Erro Socket.IO:: ${error}`;
      console.log("Socket: ", msg);
      io.emit(APP.ERROR, { msg });
    }
  });
}
