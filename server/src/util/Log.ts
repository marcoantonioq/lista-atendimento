import * as fs from "fs";

export function log(...args: any[]) {
  fs.appendFile(
    `./log/${new Date().toISOString().replace(/T.*/, "")}.log`,
    `${args.join(" | ")}\n`,
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error("Erro ao adicionar log ao arquivo:", err);
        return;
      }
      console.log("Log: ", ...args);
    }
  );
}
