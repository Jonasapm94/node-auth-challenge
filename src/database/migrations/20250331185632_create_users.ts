import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('encryptedPassword').notNullable();
    table.enum('role', ['admin', 'dealership']).notNullable();
    table.integer('dealershipId').nullable().references('id').inTable('dealerships');
    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
