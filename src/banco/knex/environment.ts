import { Knex } from 'knex';
import * as path from 'path';

const connection = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: `dev-${process.env.DATABASE_NAME}`,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  decimalNumbers: true, // Essa opção faz com que os decimais sejam retornados como números
  dateStrings: true, // Essa opção faz com que os dataTime sejam retornados como string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeCast: function (field: any, next: any) {
    if (field.type == 'TINY' && field.length == 1) {
      return field.string() == '1'; // 1 = true, 0 = false
    }
    return next();
  },
};

const development: Knex.Config = {
  client: 'mysql2',
  migrations: {
    directory: path.resolve(__dirname, '..', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds'),
  },
  connection: { ...connection, database: `dev-${process.env.DATABASE_NAME}` },
};

const production: Knex.Config = {
  client: 'mysql2',
  migrations: {
    directory: path.resolve(__dirname, '..', 'migrations'),
    extension: 'js',
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds'),
    extension: 'js',
  },
  connection: { ...connection, database: process.env.DATABASE_NAME },
};

export { development, production };
