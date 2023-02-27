import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

export const options = {
  port: PORT,
  dbConnectionUrl: process.env.DB_CONNECTION_URL,
  appName: 'bc-iad',
} as const;
