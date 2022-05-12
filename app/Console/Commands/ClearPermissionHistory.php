<?php

namespace App\Console\Commands;

use App\Packages\Common\Application\Services\PermissionHistoryService;
use Illuminate\Console\Command;
use Spatie\Multitenancy\Commands\Concerns\TenantAware;
use Spatie\Multitenancy\Models\Tenant;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ClearPermissionHistory extends Command
{
    use TenantAware {
        execute as protected tenant_execute;
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cp:clear-permission-history {--tenant=*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear permission history';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        $tenant = $this->option('tenant');
        if (empty($tenant)) {
            if (!$this->confirm('Do you really want to clean history for all tenants?')) {
                return 0;
            }
        }
        return $this->tenant_execute($input, $output);
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        (new PermissionHistoryService())->clearHistory();
        $this->info('Permission history has been cleared for tenant: ' . Tenant::current()->name);
        return true;
    }

}
