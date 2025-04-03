import { clean } from "knex-cleaner";
import { makeDatabase } from "../../database/database.js";

export const setupIntegrationTest = async () => {
  const database = makeDatabase();

  await database.connect();

  return {
    cleanDatabase: () => clean(database.connection),
    tearDown: () => database.disconnect(),
  };
};

export type IntegrationTest = Awaited<ReturnType<typeof setupIntegrationTest>>;
