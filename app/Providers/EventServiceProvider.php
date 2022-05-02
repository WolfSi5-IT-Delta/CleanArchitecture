<?php

namespace App\Providers;

use App\Models\Common\Team;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use Casbin\Enforcer;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Packages\Common\Application\Services\PermissionHistoryService;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        \SocialiteProviders\Manager\SocialiteWasCalled::class => [
            // ... other providers
            \SocialiteProviders\Bitrix24\Bitrix24ExtendSocialite::class.'@handle',
        ],
    ];

    /**
     * The subscriber classes to register.
     *
     * @var array
     */
    protected $subscribe = [
        PermissionHistoryService::class,
        AuthorisationService::class
    ];

    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
//        Team::class => [PermissionHistoryService::class],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
