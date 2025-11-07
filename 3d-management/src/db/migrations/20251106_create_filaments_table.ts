
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('filaments', (table) => {
    table.increments('id').primary();
    table.string('type').notNullable();
    table.string('color').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('price', 10, 2).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('filaments');
}
