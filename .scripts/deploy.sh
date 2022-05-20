#!/bin/bash
set -e

echo "Deployment started ..."

# Enter maintenance mode or return true
# if already is in maintenance mode
(php80 artisan down) || true

# Pull the latest version of the app
git pull origin production

# Install composer dependencies
php80 composer.phar install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Clear the old cache
php80 artisan clear-compiled

# Recreate cache
php80 artisan optimize

yarn install --non-interactive

# Compile npm assets
npm run production

# Run database migrations
php80 artisan migrate --path=database/migrations/landlord --database=landlord --force
php80 artisan tenants:artisan "migrate --force"

# Exit maintenance mode
php80 artisan up

echo "Deployment finished!"
