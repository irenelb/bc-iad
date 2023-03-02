import type {} from 'express';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ErrorResponse from './ErrorResponse.js';

export function errorResponseMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { statusCode, error } =
    err instanceof ErrorResponse
      ? { statusCode: err.statusCode, error: err.error }
      : { statusCode: httpStatus.INTERNAL_SERVER_ERROR, error: undefined };

  res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
    error,
  });
  next();
  return;
}

export function defaultMiddleware(_: Request, res: Response): void {
  res.status(httpStatus.NOT_FOUND).send('not found');
}
