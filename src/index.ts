import { dbConnection } from './configs/dbConfig.js';
import './configs/options.js';
import { startServer } from './configs/server.js';

await dbConnection();
startServer();
