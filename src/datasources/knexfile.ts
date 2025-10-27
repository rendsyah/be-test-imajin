import 'reflect-metadata';
import path from 'path';

const config = {
  client: process.env.DB_TYPE,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  migrations: {
    extension: 'js',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    extension: 'js',
    directory: path.join(__dirname, 'seeds'),
  },
  useNullAsDefault: true,
};

module.exports = config;
