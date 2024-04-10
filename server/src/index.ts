import { app } from "./app";
import { startGIT } from "./modules/git";
import { startGOOGLE } from "./modules/google";
import { startHTTP } from "./modules/http";
import { startSTORE } from "./modules/localstore";

process.env.TZ = "America/Sao_Paulo";

async function init() {
  try {
    await startSTORE(app);
  } catch (error) {
    console.error("Error na aplicação store: ", error);
  }
  try {
    await startGOOGLE(app);
  } catch (error) {
    console.error("Error na aplicação google: ", error);
  }
  try {
    await startHTTP(app);
  } catch (error) {
    console.error("Error na aplicação http: ", error);
  }
  try {
    await startGIT(app);
  } catch (error) {
    console.error("Error na aplicação git: ", error);
  }
}

init();
