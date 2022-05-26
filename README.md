# Installation
```shell
composer install
yarn
yarn watch
```
add to `/etc/hosts`   
`127.0.0.1 tenant1.localhost`

## Database

```mysql
CREATE DATABASE landlord DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'landlord'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON landlord.* TO 'landlord'@'localhost';
GRANT CREATE ON *.* TO 'landlord'@'localhost';

CREATE DATABASE db_tenant1 DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE DATABASE db_tenant2 DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE USER 'tenant_user'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON db_tenant1.* TO 'tenant_user'@'localhost';
GRANT ALL PRIVILEGES ON db_tenant2.* TO 'tenant_user'@'localhost';

FLUSH PRIVILEGES;
```
## Laravel
```shell
php artisan key:generate
php artisan migrate --path=database/migrations/landlord --database=landlord --seed
php artisan tenants:artisan "migrate --database=tenant --seed"
php artisan storage:link
```

## Bitrix24

**for local dev**, add to .env (from Paroler)
```dotenv
BITRIX24_CLIENT_ID='client_id_here'
BITRIX24_CLIENT_SECRET='secret_here'
```

**for prod**, add to landlord database, table 'tenants':  
```json
{
  "integration": {
    "type": "bitrix24",
    "endpoint": null,
    "redirect": null,
    "client_id": null,
    "client_secret": null
  }
}
```
Needed data from clients B24

```shell
php artisan serve --port=8002
```  
User:  
user@aa.com   
123

## Useful commands
This command helps to clear all the cache:
```shell
php artisan optimize:clear
```
