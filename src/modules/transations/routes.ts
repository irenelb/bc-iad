import { TSchema, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import express, { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { fakeDelay } from '../../utils/fakeDelay.js';
import { getRandomInt } from '../../utils/randomInt.js';
import { Transaction, TransactionModel } from '../models/Transaction.js';

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
    const { amount, type } = req.body as Transaction;
    const responseTimeHistogram = req.metrics.responseTime;
    req.metrics.totalRequests.labels({ type }).inc();
    responseTimeHistogram.zero({ type });
    const fakeBalance = getRandomInt(0, amount * 2);
    const end = responseTimeHistogram.startTimer();
    let seconds = 0;
    switch (type) {
      case 'bonifico':
        seconds = getRandomInt(10, 60);
        break;
      case 'investimento':
        seconds = getRandomInt(20, 30);
        break;
      case 'prelievo':
        seconds = getRandomInt(0, 5);
        break;
    }
    await fakeDelay(seconds);

    if (fakeBalance < amount) {
      end();
      req.metrics.totalFailedTransaction.labels({ type }).inc();
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Invalid transaction' });
      return;
    }

    const newTransacton = new TransactionModel({
      amount,
      type,
      date: new Date(),
    });
    await newTransacton.save();
    end();
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
