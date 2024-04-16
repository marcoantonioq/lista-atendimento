import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { ISecret } from "../../app";

export class GoogleSheetManager {
  private static instance: GoogleSheetManager | null = null;
  private auth: GoogleAuth | null = null;
  private sheets: sheets_v4.Sheets | undefined;

  private constructor() {}

  public static getInstance(): GoogleSheetManager {
    if (!GoogleSheetManager.instance) {
      GoogleSheetManager.instance = new GoogleSheetManager();
    }
    return GoogleSheetManager.instance;
  }

  public reAuth(credentials: ISecret) {
    try {
      this.auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      this.sheets = google.sheets({
        version: "v4",
        auth: this.auth,
      });
    } catch (error) {
      throw new Error("Credenciais de acesso para Google APIs inválidas!");
    }
  }

  public async getSheetData(spreadsheetId: string, range: string) {
    if (!this.sheets) {
      throw new Error("Por favor, faça autenticação antes de acessar dados da planilha.");
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao obter dados da planilha: " + error);
    }
  }

  public async updateSheetData(spreadsheetId: string, range: string, values: any[][]) {
    if (!this.sheets) {
      throw new Error("Por favor, faça autenticação antes de atualizar dados da planilha.");
    }

    try {
      const resource = {
        values: values,
      };
      const request = {
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: resource,
      };
      const response = await this.sheets.spreadsheets.values.update(request);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao atualizar dados da planilha: " + error);
    }
  }
}
