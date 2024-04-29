import fs from "fs";
import path from "path";
import { IApp, IEvento } from "../../app";
import { sortEvento } from "../evento/sortEventos";

const PATH_CONFIG = path.join(__dirname, "../../../../config/config.json");
const PATH_DATA = path.join(__dirname, "../../../../config/data.json");
const PATH_DATA2 = path.join(
  __dirname,
  "../../../../client/dist/pwa/data/data.json"
);
const PATH_DATA3 = path.join(
  __dirname,
  "../../../../client/public/data/data.json"
);

async function saveDataToFile(path: string, values: string) {
  await fs.promises.writeFile(path, values);
}

async function readDataFromFile(path: string, values: string) {
  if (fs.existsSync(path)) {
    return JSON.parse(await fs.promises.readFile(path, "utf-8"));
  } else {
    console.log(`Criando arquivo de configuração ${path}...`);
    await saveDataToFile(path, values);
  }
}

export async function salvarStore(app: IApp) {
  sortEvento(app);
  try {
    console.log("Salvando lista...");
    app.system.save = true;

    if(!app.system.token){
      console.log("Erro ao salvar. Valores indefinidos!")
      return
    }

    await saveDataToFile(PATH_CONFIG, JSON.stringify(app, null, 2));

    const data = {
      eventos: {
        items: app.eventos.items,
      },
    };

    await saveDataToFile(PATH_DATA, JSON.stringify(data, null, 2));
    await saveDataToFile(PATH_DATA2, JSON.stringify(data, null, 2));
    await saveDataToFile(PATH_DATA3, JSON.stringify(data, null, 2));
    app.system.save = false;
  } catch (error) {
    console.log("LocalStore: Erro ao salvar aquivo: ", error);
  }
}

export async function startSTORE(app: IApp) {
  console.log("MODULO: Storage");
  try {
    const data = await readDataFromFile(
      PATH_CONFIG,
      JSON.stringify(app, null, 2)
    );
    if (data) {
      app.git = data.git;
      app.google = data.google;
      app.system = data.system;
      app.system.rebooting = false;
      app.eventos = data.eventos;
      app.eventos.items = app.eventos.items.map((event: IEvento) => ({
        ...event,
        date: new Date(event.date),
        end: event.end ? new Date(event.end) : undefined,
        updated: event.updated ? new Date(event.updated) : undefined,
      }));
    }

    salvarStore(app);
  } catch (error) {
    console.log("Erro ao acessar arquivo:", PATH_CONFIG);
  }
}
