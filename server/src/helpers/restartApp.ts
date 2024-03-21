import { spawn } from "child_process";

export function restartApp(): void {
  const command = "nodemon"; // ou 'npx nodemon' se não estiver instalado globalmente
  const args = ["app.ts"]; // substitua 'app.ts' pelo nome do seu arquivo principal

  const appProcess = spawn(command, args, { stdio: "inherit" });

  appProcess.on("close", (code: number) => {
    if (code !== 0) {
      console.error("A aplicação falhou ao reiniciar.");
      setTimeout(restartApp, 1000); // Reiniciar após 1 segundo (1000ms)
    }
  });
}
