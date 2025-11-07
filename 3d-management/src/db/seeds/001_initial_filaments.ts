import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('filaments').del();

  // Insert initial data matching current schema
  await knex('filaments').insert([
    { type: 'PLA', color: 'Red', quantity: 5, price: 89.9 },
    { type: 'PLA', color: 'Black', quantity: 8, price: 85.5 },
    { type: 'PETG', color: 'White', quantity: 4, price: 99.0 },
    { type: 'ABS', color: 'Blue', quantity: 3, price: 94.0 },
    { type: 'TPU', color: 'Transparent', quantity: 2, price: 129.0 }
  ]);
}
