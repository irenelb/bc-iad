#!/usr/bin/env zx
import { spinner } from 'zx/experimental';
import prettyMilliseconds from 'pretty-ms';
import 'zx/globals';
const {
  url = 'http://localhost:3000',
  times = 10,
  ms = 3000,
  debug = false,
} = argv;

$.verbose = false;

if (debug) await spinner('wait 5 seconds', () => $`sleep 5`);

setInterval(async () => {
  echo('call interval, starting...');
  const startAt = performance.now();
  const results = await Promise.allSettled(
    Array.from({ length: times }, callEndpoint)
  );
  const endAt = performance.now();
  const diff = endAt - startAt;
  echo(chalk.red(`${prettyMilliseconds(diff)}`));

  results.forEach((r) => echo(YAML.stringify(r)));
}, ms);

function callEndpoint() {
  return new Promise(async (resolve, reject) => {
    const body = buildBody();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body,
      });
      if (res.status) {
        resolve({ status: res.status, ...JSON.parse(body) });
      }
    } catch (error) {
      reject(error);
    }
  });
}

function buildBody() {
  const transactionsType = ['bonifico', 'prelievo', 'investimento'];
  const randomType =
    transactionsType[Math.floor(Math.random() * transactionsType.length)];
  let max = 0;
  switch (randomType) {
    case transactionsType[0]:
      max = 10000;
      break;
    case transactionsType[1]:
      max = 1000;
      break;
    case transactionsType[2]:
      max = 1000000;
      break;

    default:
      break;
  }
  const body = {
    amount: Math.floor(Math.random() * max) + 1,
    type: randomType,
  };

  return JSON.stringify(body);
}
