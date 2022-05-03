<?php

namespace App\Providers;

use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Utils\ConfigStorage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(IAuthorisationService::class, AuthorisationService::class);

//        $this->app->when(Question::class)
//            ->needs(RepositoryInterface::class)
//            ->give(function () {
//                return new QuestionRepository();
//            });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $tenant = app('currentTenant');
        $options = json_decode($tenant?->options);
        ConfigStorage::set('modules', $options?->modules ?? []);
    }
}
