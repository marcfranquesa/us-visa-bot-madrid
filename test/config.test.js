import assert from 'node:assert/strict';
import { getBaseUri, getConfig } from '../src/lib/config.js';

const keys = ['EMAIL', 'PASSWORD', 'SCHEDULE_ID', 'FACILITY_ID', 'BASE_URI', 'COUNTRY_CODE', 'REFRESH_DELAY'];
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));

function setEnv(values) {
  for (const key of keys) {
    delete process.env[key];
  }

  Object.assign(process.env, values);
}

try {
  setEnv({
    EMAIL: 'user@example.com',
    PASSWORD: 'secret',
    SCHEDULE_ID: '123',
    FACILITY_ID: '7',
    BASE_URI: 'https://ais.usvisa-info.com/es-es/niv/',
    REFRESH_DELAY: '10'
  });

  assert.equal(getConfig().baseUri, 'https://ais.usvisa-info.com/es-es/niv');
  assert.equal(getBaseUri('fr'), 'https://ais.usvisa-info.com/en-fr/niv');

  setEnv({
    EMAIL: 'user@example.com',
    PASSWORD: 'secret',
    SCHEDULE_ID: '123',
    FACILITY_ID: '7',
    COUNTRY_CODE: 'fr'
  });

  assert.equal(getConfig().baseUri, 'https://ais.usvisa-info.com/en-fr/niv');
} finally {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}
