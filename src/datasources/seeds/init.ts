import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import argon2 from '@node-rs/argon2';

export async function seed(knex: Knex): Promise<void> {
  const getUser = await knex('users').first();

  if (getUser) return;

  const getPassword = await argon2.hash('12345678');

  await knex('users').insert([
    {
      email: 'test@gmail.com',
      password: getPassword,
      name: 'Test',
      phone: '628123456789',
    },
  ]);

  await knex('categories').insert([
    {
      name: 'Men',
      description: 'Men Categories',
    },
    {
      name: 'Women',
      description: 'Women Categories',
    },
    {
      name: 'Kids',
      description: 'Kids Categories',
    },
    {
      name: 'Bags',
      description: 'Bags Categories',
    },
  ]);

  await knex('banks').insert([
    {
      name: 'BCA',
    },
    {
      name: 'Mandiri',
    },
  ]);

  await knex('payment_methods').insert([
    {
      name: 'Virtual Account',
      description: 'Payment via Virtual Account',
    },
    {
      name: 'E-Wallet',
      description: 'Payment via E-Wallet',
    },
  ]);

  await knex('payments').insert([
    {
      method_id: 1,
      bank_id: 1,
      name: 'BCA Virtual Account',
    },
    {
      method_id: 1,
      bank_id: 2,
      name: 'Mandiri Virtual Account',
    },
    {
      method_id: 2,
      name: 'Gopay',
    },
    {
      method_id: 2,
      name: 'ShoopePay',
    },
  ]);

  const products = faker.helpers
    .uniqueArray(() => faker.commerce.productName(), 1000)
    .map((name) => {
      return {
        category_id: faker.number.int({ min: 1, max: 4 }),
        name,
        slug: faker.helpers.slugify(name.toLowerCase()),
        image: '/media/products/product.webp',
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10000, max: 1000000, dec: 0 }),
      };
    });

  await knex.batchInsert('products', products, 100);
}
