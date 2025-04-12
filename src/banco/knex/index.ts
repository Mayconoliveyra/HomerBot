import 'dotenv/config';
import { knex } from 'knex';

import { development, production } from './environment';

const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;

    default:
      return development;
  }
};

const Knex = knex(getEnvironment());

export { Knex };
