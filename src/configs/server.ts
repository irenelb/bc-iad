import { app } from './express.js';
import { options } from './options.js';

export function startServer() {
  const port = normalizePort(options.port);
  app.listen(port, () => {
    console.log(`📻 listening on port ${port}`);
  });
}

export function normalizePort(portValue: string | number = 3000): number {
  const portNumber = +portValue;

  if (!isNaN(portNumber) && portNumber >= 0 && portNumber <= 65535) {
    // port number
    return portNumber;
  }

  throw new Error(`TCP Port is not valid ${portValue}`);
}
