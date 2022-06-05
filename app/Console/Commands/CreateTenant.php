<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateTenant extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cp:create_tenant {tenant?} {locale?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create tenant';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $name = $this->argument('tenant');
        $locale = $this->argument('locale') ?? 'en';

        if (!$name) $name = 'tn' . $this->generateRandomString();
//        if (!$name) $name = 'tn' . STR::random(8);

        $database = $name;

        $url = parse_url(env('APP_URL'));
        $host = $url['host'];
        $domain = "$name.$host";

        $options = json_encode([
            'modules' => ['LC', 'OP', 'OB'],
            'integration' => [],
            'locale' => $locale
        ]);

        // create tenant account
        $res = DB::connection('landlord')
            ->insert('insert into `tenants` (`name`, `domain`, `database`, `options`, `created_at`, `just_created_token`) values (?, ? ,? ,?, ?, ?)', [
                $name,
                $domain,
                $database,
                $options,
                now(),
                $this->generateRandomString2(10)
            ]);
        if (!$res) throw new \Exception('Error while creating tenant account.');

        // get tenant id
        $rec = DB::connection('landlord')
            ->select('select id from `tenants` where `name` = ?', [$name]);
        $id = collect($rec)->first()?->id;
        if (!$id) throw new \Exception('Error while getting tenant account.');

        // create tenant database
        $res = DB::connection('landlord')->statement("CREATE DATABASE $database");
        if (!$res) throw new \Exception('Error while creating tenant database.');

        // run migrations
        $path = base_path();
        $res = shell_exec("php $path/artisan tenants:artisan migrate --tenant=$id");
        $this->info($res);
        // run seeder
        $res = shell_exec("php {$path}/artisan tenants:artisan 'db:seed --class=TenantSeeder' --tenant=$id");
        $this->info($res);
        logger($res);

        $this->info("The tenant $name was created successfully!");
        return $id;
    }

    // generate random str for url
    private function generateRandomString2($length = 8)
    {
        return bin2hex(random_bytes($length));
    }

    private function generateRandomString($length = 8)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
