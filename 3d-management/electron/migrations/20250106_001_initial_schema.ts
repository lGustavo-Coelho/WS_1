import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.string('id').primary();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.string('role').notNullable().defaultTo('user');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Settings table
  await knex.schema.createTable('settings', (table) => {
    table.string('id').primary();
    table.string('currency').notNullable().defaultTo('BRL');
    table.string('language').notNullable().defaultTo('pt-BR');
    table.decimal('energy_cost_per_kwh', 10, 2).notNullable().defaultTo(0);
    table.decimal('labor_cost_per_hour', 10, 2).notNullable().defaultTo(0);
    table.decimal('default_profit_margin', 5, 2).notNullable().defaultTo(0);
    table.string('company_name');
    table.text('company_address');
    table.string('company_phone');
    table.string('company_email');
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Filaments table
  await knex.schema.createTable('filaments', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('type').notNullable();
    table.string('color').notNullable();
    table.string('brand').notNullable();
    table.decimal('cost_per_kg', 10, 2).notNullable();
    table.decimal('stock_kg', 10, 3).notNullable().defaultTo(0);
    table.decimal('density', 5, 3).notNullable().defaultTo(1.24);
    table.string('supplier');
    table.date('purchase_date');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Components table
  await knex.schema.createTable('components', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('category').notNullable();
    table.decimal('cost_per_unit', 10, 2).notNullable();
    table.integer('stock').notNullable().defaultTo(0);
    table.string('supplier');
    table.date('purchase_date');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Printers table
  await knex.schema.createTable('printers', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('model').notNullable();
    table.string('status').notNullable().defaultTo('available');
    table.decimal('nozzle_size', 3, 2).notNullable().defaultTo(0.4);
    table.decimal('power_consumption', 10, 2).notNullable().defaultTo(0);
    table.decimal('purchase_price', 10, 2).notNullable().defaultTo(0);
    table.date('purchase_date');
    table.integer('total_print_hours').notNullable().defaultTo(0);
    table.text('maintenance_history');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Products table
  await knex.schema.createTable('products', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('category').notNullable();
    table.string('filament_id').references('id').inTable('filaments').onDelete('SET NULL');
    table.decimal('filament_weight_g', 10, 2).notNullable().defaultTo(0);
    table.string('printer_id').references('id').inTable('printers').onDelete('SET NULL');
    table.decimal('print_time_hours', 10, 2).notNullable().defaultTo(0);
    table.integer('stock').notNullable().defaultTo(0);
    table.decimal('sale_price', 10, 2).notNullable().defaultTo(0);
    table.string('image_url');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Print Jobs table
  await knex.schema.createTable('print_jobs', (table) => {
    table.string('id').primary();
    table.string('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.string('printer_id').references('id').inTable('printers').onDelete('SET NULL');
    table.string('status').notNullable().defaultTo('pending');
    table.integer('quantity').notNullable().defaultTo(1);
    table.timestamp('start_time');
    table.timestamp('end_time');
    table.decimal('actual_filament_used_g', 10, 2);
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Quotes table
  await knex.schema.createTable('quotes', (table) => {
    table.string('id').primary();
    table.string('customer_name').notNullable();
    table.string('customer_email');
    table.string('customer_phone');
    table.string('status').notNullable().defaultTo('pending');
    table.json('items').notNullable();
    table.decimal('total_amount', 10, 2).notNullable();
    table.date('valid_until');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Sales table
  await knex.schema.createTable('sales', (table) => {
    table.string('id').primary();
    table.string('customer_name').notNullable();
    table.string('customer_email');
    table.string('customer_phone');
    table.json('items').notNullable();
    table.decimal('total_amount', 10, 2).notNullable();
    table.string('payment_method').notNullable();
    table.string('payment_status').notNullable().defaultTo('pending');
    table.date('sale_date').notNullable();
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Transactions table
  await knex.schema.createTable('transactions', (table) => {
    table.string('id').primary();
    table.string('type').notNullable();
    table.string('category').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.text('description').notNullable();
    table.date('date').notNullable();
    table.string('reference_id');
    table.string('reference_type');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Investments table
  await knex.schema.createTable('investments', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('category').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.date('date').notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('investments');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('sales');
  await knex.schema.dropTableIfExists('quotes');
  await knex.schema.dropTableIfExists('print_jobs');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('printers');
  await knex.schema.dropTableIfExists('components');
  await knex.schema.dropTableIfExists('filaments');
  await knex.schema.dropTableIfExists('settings');
  await knex.schema.dropTableIfExists('users');
}
