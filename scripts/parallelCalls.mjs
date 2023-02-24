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

const startAt = process.hrtime();
//call the receiver service
const results = await Promise.allSettled(promises);
const diff = process.hrtime(startAt);

echo(chalk.red(`${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2)}ms`));

results.forEach(r => echo(YAML.stringify(r)));

function callReceiver() {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-request-id': nanoid(),
        'x-uid-sub': 'sub1234-xxx',
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
        ),
      });
    } else {
      resolve({
        response: await res.json(),
        'x-header': [...res.headers].find(
          ([head]) => head === 'x-request-time'
        ),
      });
    }
  });
}
