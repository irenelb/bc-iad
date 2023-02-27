import { NextFunction, Request, Response } from 'express';
import client, { Counter } from 'prom-client';
import { options } from './options.js';
declare module 'http' {
  interface IncomingMessage {
    metrics: ReturnType<typeof metricsConf.collectMetrics>;
  }
}

function metrics() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  const register = new client.Registry();
  collectDefaultMetrics({ register, labels: { appName: options.appName } });
  const configMetrics = {
    totalRequests: new Counter({
      name: 'requests_total',
      help: 'Number of requests in total',
      labelNames: ['type'],
      registers: [register],
    }),
    totalFailedTransaction: new Counter({
      name: 'failed_transactions_total',
      help: 'Number of failed transaction in total',
      labelNames: ['type'],
      registers: [register],
    }),
    responseTime: new client.Histogram({
      name: 'transaction_response_time',
      help: 'how long it takes to execute a transaction',
      buckets: [0.5, 5, 15, 30, 60, 90],
      labelNames: ['type'],
      registers: [register],
    }),
  };

  function metricsInjectorMiddleware(
    req: Request,
    _: Response,
    next: NextFunction
  ) {
    req.metrics = configMetrics;
    next();
  }

  async function monitoringMiddleware(_: Request, res: Response) {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  }

  function collectMetrics() {
    return configMetrics;
  }
  return {
    monitoringMiddleware,
    collectMetrics,
    metricsInjectorMiddleware,
  };
}

export const metricsConf = metrics();
