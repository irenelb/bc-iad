import mongoose from 'mongoose';
import { applicationStatus } from './appStatus.js';
import { options } from './options.js';

export async function dbConnection() {
  if (!options.dbConnectionUrl) {
    throw new Error('unable to find connection url');
  }
  mongoose.set('strictQuery', false);
  await mongoose.connect(options.dbConnectionUrl);
}

mongoose.connection.on('error', (err) => {
  applicationStatus.changeStatus({ isAbleToHandleRequest: false });
  console.log({ mongoError: err });
});
mongoose.connection.on('disconnected', () => {
  applicationStatus.changeStatus({ isAbleToHandleRequest: false });
  console.log(`mongo disconnected`);
});
mongoose.connection.on('reconnected', () => {
  applicationStatus.changeStatus({ isAbleToHandleRequest: true });
  console.log(`mongo reconnected`);
});
