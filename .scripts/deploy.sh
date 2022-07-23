#!/bin/bash
set -e

echo "Deployment started ..."

# Enter maintenance mode or return true
# if already is in maintenance mode
(php artisan down) || true

# Pull the latest version of the app
git pull origin production

# Install composer dependencies
php composer.phar install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Clear the old cache
php artisan clear-compiled

# Recreate cache
php artisan optimize

yarn install --non-interactive

# Compile npm assets
npm run production

# Run database migrations
php artisan migrate --path=database/migrations/landlord --database=landlord --force
php artisan tenants:artisan "migrate --force"

php artisan config:clear

# Exit maintenance mode
php artisan up

echo "Deployment finished!"
