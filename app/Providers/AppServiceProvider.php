<?php

namespace App\Providers;

use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Utils\ConfigStorage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
        $passwordMinLength = $this->app->isLocal() ? 1 : 6;
        Password::defaults(function () use ($passwordMinLength) {
            $rule = Password::min($passwordMinLength);
            return $rule;
        });
    }
}
