import { TSchema, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import express, { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { TransactionModel } from '../models/Transaction.js';

export const router = express.Router();

router.get('/', async (_, res) => {
  const transactions = await TransactionModel.find({});
  res.status(httpStatus.OK).json(transactions.map((t) => t.toObject()));
});
router
  .use(
    validateReqMiddleware(
      Type.Object(
        {
          type: Type.String({ enum: ['prelievo', 'bonifico', 'investimento'] }),
          amount: Type.Number(),
        },
        { additionalProperties: false }
      )
    )
  )
  .post('/', async (req, res) => {
    const { amount, type } = req.body;
    const newTransacton = new TransactionModel({
      amount,
      type,
      date: new Date(),
    });
    await newTransacton.save();
    res.sendStatus(httpStatus.CREATED);
  });

function validateReqMiddleware<T extends TSchema>(schema: T) {
  return function validateRequestBody(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const checkErrors = [...Value.Errors(schema, req.body)];
    if (checkErrors.length === 0) {
      next();
      return;
    }
    res.status(httpStatus.BAD_REQUEST).send(checkErrors);
  };
}
