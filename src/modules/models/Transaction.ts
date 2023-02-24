import { Model, model, Schema } from 'mongoose';

export const transactionSchema = new Schema<Transaction>(
  {
    amount: { type: Number, require: true },
    type: {
      type: String,
      enum: ['bonifico', 'investimento', 'prelievo'],
    },
    date: { type: Date, require: false },
  },
  {
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
  }
);

export interface Transaction extends Document {
  amount: number;
  date: Date;
  type: 'bonifico' | 'investimento' | 'prelievo';
}

export const TransactionModel = model<Transaction, Model<Transaction>>(
  'Transaction',
  transactionSchema
);
