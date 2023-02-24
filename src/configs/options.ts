import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

export const options = {
  port: PORT,
  appName: 'service-to-monitor',
  dbConnectionUrl: process.env.DB_CONNECTION_URL,
} as const;
