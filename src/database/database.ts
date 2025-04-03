import Knex from 'knex';
import { config } from '../config.js';
import { BaseModel } from './models/BaseModel.js';

const makeDatabase = () => {
  const knex = Knex({
    ...config.db[config.env],
    debug: true,
  });

  BaseModel.knex(knex);

  return {
    connection: knex,

    async connect() {
      await knex.raw('SELECT 1');
      console.log('Database connected successfully.');
    },

    async disconnect() {
      await knex.destroy();
      console.log('Database disconnected successfully.');
    },
  };
};

export { makeDatabase };
