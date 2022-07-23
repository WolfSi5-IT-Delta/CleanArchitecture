<?php

namespace App\Providers;

use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use App\Packages\Utils\ConfigStorage;
use Illuminate\Support\Facades\App;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Spatie\Multitenancy\Models\Tenant;
use App\Packages\Common\Application\Services\UserInvitationService;

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
        $this->app->bind(UserInvitationService::class, UserInvitationService::class);

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
        $passwordMinLength = !$this->app->isLocal() ? 1 : 6;
        Password::defaults(function () use ($passwordMinLength) {
            $rule = Password::min($passwordMinLength);
            return $rule;
        });

        // Locale
        $tenant = Tenant::current();
        $locale = json_decode($tenant?->options)?->locale ?? 'en';
        App::setLocale($locale);
//        App::setLocale('ru');
    }
}
