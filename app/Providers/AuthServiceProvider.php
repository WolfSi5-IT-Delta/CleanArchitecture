<?php

namespace App\Providers;

use App\Models\User;
use App\Packages\Utils\ConfigStorage;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::before(function (User $user,  $ability) {
            if ($user->admin) return true;
        });

        Gate::define('package', function (User $user, ...$packages) {
            $modules = ConfigStorage::get('modules', []);
            foreach ($packages as $value) {
                if (!in_array($value, $modules)) return false;
            }
            return true;
        });
    }
}
