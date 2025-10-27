import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable UUID extension
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  // Device platform type
  await knex.raw(`
    CREATE TYPE user_device_platform AS ENUM (
      'Web', 'Mobile'
    )
  `);

  // CATEGORIES
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description').notNullable();
    table.smallint('status').defaultTo(1).notNullable().comment('0 -> inactive, 1 -> active');
    table.timestamps(true, true);
  });

  // BANKS
  await knex.schema.createTable('banks', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });

  // PAYMENT METHODS
  await knex.schema.createTable('payment_methods', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('description').notNullable();
    table.smallint('status').defaultTo(1).notNullable().comment('0 -> inactive, 1 -> active');
    table.timestamps(true, true);
  });

  // PAYMENTS
  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('method_id').unsigned().notNullable().references('id').inTable('payment_methods');
    table.integer('bank_id').unsigned().nullable().references('id').inTable('banks');
    table.string('name', 100).notNullable();
    table.smallint('status').defaultTo(1).notNullable().comment('0 -> inactive, 1 -> active');
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('payments', (table) => {
    table.index('method_id');
    table.index('bank_id');
  });

  // PRODUCTS
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.integer('category_id').unsigned().notNullable().references('id').inTable('categories');
    table.string('name', 255).notNullable();
    table.string('slug', 255).unique().notNullable();
    table.string('image', 100).nullable();
    table.text('description').notNullable();
    table.decimal('price', 15, 0).notNullable();
    table.smallint('status').defaultTo(1).notNullable().comment('0 -> inactive, 1 -> active');
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('products', (table) => {
    table.index('category_id');
  });

  // USERS
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('uuid_generate_v4()')).notNullable();
    table.string('email', 150).unique().notNullable();
    table.string('password', 100).notNullable();
    table.string('name', 100).notNullable();
    table.string('phone', 25).notNullable();
    table.string('image', 100).nullable();
    table.smallint('status').defaultTo(1).notNullable().comment('0 -> inactive, 1 -> active');
    table.timestamps(true, true);
  });

  // USER_DEVICES
  await knex.schema.createTable('user_devices', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    table.string('firebase_id', 150).nullable();
    table.string('device_browser', 100).nullable();
    table.string('device_browser_version', 25).nullable();
    table.string('device_imei', 100).nullable();
    table.string('device_model', 100).nullable();
    table.string('device_type', 50).nullable();
    table.string('device_vendor', 50).nullable();
    table.string('device_os', 25).nullable();
    table.string('device_os_version', 25).nullable();
    table.specificType('device_platform', 'user_device_platform').notNullable();
    table.text('user_agent').nullable();
    table.string('app_version', 25).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('user_devices', (table) => {
    table.index('user_id');
  });

  // CARTS
  await knex.schema.createTable('carts', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('uuid_generate_v4()')).notNullable();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    table.integer('product_id').unsigned().notNullable().references('id').inTable('products');
    table.integer('quantity').notNullable();
    table.decimal('amount', 15, 0).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('carts', (table) => {
    table.index('user_id');
    table.index('product_id');
  });

  // TRANSACTIONS
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.uuid('uuid').unique().defaultTo(knex.raw('uuid_generate_v4()')).notNullable();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    table.integer('payment_id').unsigned().notNullable().references('id').inTable('payments');
    table.decimal('amount', 15, 0).notNullable();
    table.smallint('status').defaultTo(1).notNullable().comment('0 -> pending, 1 -> success');
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('transactions', (table) => {
    table.index('user_id');
    table.index('payment_id');
  });

  // TRANSACTION ITEMS
  await knex.schema.createTable('transaction_items', (table) => {
    table.increments('id').primary();
    table
      .integer('transaction_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('transactions');
    table.integer('product_id').unsigned().notNullable().references('id').inTable('products');
    table.integer('quantity').notNullable();
    table.decimal('price', 15, 0).notNullable();
    table.decimal('amount', 15, 0).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('transaction_items', (table) => {
    table.index('transaction_id');
    table.index('product_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transaction_items');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('carts');
  await knex.schema.dropTableIfExists('user_devices');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('payment_methods');
  await knex.schema.dropTableIfExists('brands');
  await knex.schema.dropTableIfExists('banks');
  await knex.schema.dropTableIfExists('categories');
  await knex.raw(`DROP TYPE IF EXISTS user_device_platform`);
}
