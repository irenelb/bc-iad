import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { applicationStatus } from '../configs/appStatus.js';

export function healthcheckMiddleware(_: Request, res: Response) {
  if (applicationStatus.status()) {
    res.status(httpStatus.OK).json({ status: 'ok' });
    return;
  }
  res.status(httpStatus.OK).json({ status: 'error' });
}
