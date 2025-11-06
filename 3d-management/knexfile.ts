
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/3d-management.sqlite'
    },
    migrations: {
      directory: './src/db/migrations'
    },
    useNullAsDefault: true
  }
};

module.exports = config;
