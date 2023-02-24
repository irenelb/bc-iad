import { Request, Response } from 'express';
import client, { Counter } from 'prom-client';
import { options } from './options.js';

export function metrics() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  const register = new client.Registry();
  collectDefaultMetrics({ register, labels: { appName: options.appName } });
  const configMetrics = {
    totalRequests: new Counter({
      name: 'requests_total',
      help: 'Number of requests in total',
      registers: [register],
    }),
  };

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
  return { monitoringMiddleware, collectMetrics };
}

export default metrics();
