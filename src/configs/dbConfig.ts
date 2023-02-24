import mongoose from 'mongoose';
import { options } from './options.js';

export async function dbConnection() {
  if (!options.dbConnectionUrl) {
    throw new Error('unable to find connection url');
  }
  mongoose.set('strictQuery', false);
  await mongoose.connect(options.dbConnectionUrl);
}
