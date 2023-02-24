#!/usr/bin/env zx
import { nanoid } from 'nanoid';
import 'zx/globals';
import { spinner } from 'zx/experimental';
const {
  url = 'http://localhost:3000/receiver/_send',
  times = 10,
  debug = false,
} = argv;

$.verbose = false;

if (debug) await spinner('wait 5 seconds', () => $`sleep 5`);
const promises = Array.from({ length: times }, callReceiver);

for (const promise of promises) {
  await delay(1000 * 5); //wait 5 sec
  const startAt = process.hrtime.bigint();
  const result = await promise;
  echo(YAML.stringify(result));
  const endAt = process.hrtime.bigint();
  const diff = endAt - startAt;
  echo(chalk.red(`${(Number(diff) * 1e-6).toFixed(2)}ms`));
  echo('************************************************');
}

function callReceiver() {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-request-id': nanoid(),
      },
      body: JSON.stringify({
        id: nanoid(),
        data: 5,
      }),
    });
    if (res.status >= 400) {
      reject({
        response: await res.json(),
        'x-header': [...res.headers].find(
          ([head]) => head === 'x-request-time'
        )[1],
      });
    } else {
      resolve({
        response: await res.json(),
        'x-header': [...res.headers].find(
          ([head]) => head === 'x-request-time'
        )[1],
      });
    }
  });
}

function delay(ms) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}
