import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import { router } from '../modules/transations/routes.js';
import { metricsConf } from './metricsConfig.js';
import { healthcheckMiddleware } from '../middlewares/healthcheckMiddleware.js';
import {
  defaultMiddleware,
  errorResponseMiddleware,
} from '../middlewares/defaultMiddleware.js';
export const app = express();

app
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(metricsConf.metricsInjectorMiddleware)
  .use('/transactions', router)
  .use('/healthcheck', healthcheckMiddleware)
  .use('/metrics', metricsConf.monitoringMiddleware)
  .use(defaultMiddleware)
  .use(errorResponseMiddleware);
