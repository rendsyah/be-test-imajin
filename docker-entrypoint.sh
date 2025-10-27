#!/bin/sh
set -e

# Run database migrations
npx knex migrate:latest --knexfile dist/datasources/knexfile.js

# Run database seeding
npx knex seed:run --knexfile dist/datasources/knexfile.js

# Start the application
exec node dist/main