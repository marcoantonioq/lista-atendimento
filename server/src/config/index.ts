// config.ts
import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  token: process.env.SOCKET_TOKEN || "TOKEN_DEFAULT",
  dateFirst: new Date(new Date().getTime() - 60 * 60 * 1000), // -60 min
  dateLast: new Date(new Date().getTime() + 80 * 24 * 60 * 60 * 1000), // 80 days
};
