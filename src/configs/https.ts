import fs from 'fs';

const { NODE_ENV } = process.env;

const key = NODE_ENV === 'dev' ? '' : fs.readFileSync('/etc/letsencrypt/live/comzap-api.com/privkey.pem', 'utf8');
const cert = NODE_ENV === 'dev' ? '' : fs.readFileSync('/etc/letsencrypt/live/comzap-api.com/fullchain.pem', 'utf8');

const httpsOptions = {
  key: key,
  cert: cert,
};

export const HttpsConfig = { httpsOptions };
