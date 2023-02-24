import test from 'ava';
import { normalizePort } from '../configs/server.js';

test('defalut port if not passed', (t) => {
  const port = normalizePort();
  t.is(port, 3000);
});
test('invalid string port', (t) => {
  const error = t.throws(
    () => {
      normalizePort('string');
    },
    { instanceOf: Error }
  );

  t.is(error?.message, 'TCP Port is not valid string');
});
test('valid string port', (t) => {
  const port = normalizePort('5000');
  t.is(port, 5000);
});
test('too high number port', (t) => {
  const error = t.throws(
    () => {
      normalizePort(555777);
    },
    { instanceOf: Error }
  );

  t.is(error?.message, 'TCP Port is not valid 555777');
});
test('negative number port', (t) => {
  const error = t.throws(
    () => {
      normalizePort(-1000);
    },
    { instanceOf: Error }
  );

  t.is(error?.message, 'TCP Port is not valid -1000');
});
