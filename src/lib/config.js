import dotenv from 'dotenv';

dotenv.config();

export function getConfig() {
  const config = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    scheduleId: process.env.SCHEDULE_ID,
    facilityId: process.env.FACILITY_ID,
    baseUri: (process.env.BASE_URI || getBaseUri(process.env.COUNTRY_CODE))?.replace(/\/+$/, ''),
    countryCode: process.env.COUNTRY_CODE,
    refreshDelay: Number(process.env.REFRESH_DELAY || 3)
  };

  validateConfig(config);
  return config;
}

function validateConfig(config) {
  const required = ['email', 'password', 'scheduleId', 'facilityId', 'baseUri'];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.map(k => k === 'baseUri' ? 'BASE_URI or COUNTRY_CODE' : k.toUpperCase()).join(', ')}`);
    process.exit(1);
  }

  if (!isAllowedBaseUri(config.baseUri)) {
    console.error('BASE_URI must point to ais.usvisa-info.com, localhost, or 127.0.0.1');
    process.exit(1);
  }
}

export function getBaseUri(countryCode) {
  if (!countryCode) {
    return undefined;
  }

  return `https://ais.usvisa-info.com/en-${countryCode}/niv`;
}

function isAllowedBaseUri(baseUri) {
  try {
    const url = new URL(baseUri);
    return ['ais.usvisa-info.com', 'localhost', '127.0.0.1'].includes(url.hostname);
  } catch {
    return false;
  }
}
