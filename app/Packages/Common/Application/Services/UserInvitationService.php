<?php

namespace App\Packages\Common\Application\Services;

use App\Models\UserInvitation;
use App\Notifications\UserInvite;
use Illuminate\Support\Facades\URL;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Packages\Common\Domain\PermissionDTO;
use App\Packages\Common\Application\Services\IAuthorisationService;
use App\Packages\Common\Infrastructure\Repositories\DepartmentRepository;
use App\Packages\Common\Application\Interfaces\DepartmentServiceInterface;
use Illuminate\Support\Facades\Date;

class UserInvitationService
{
    public function __construct()
    {
    }

    public function getInvitedUsers() {
        return [];
    }

    public function sendInvite(string $email, array $permissions) {

        $link = URL::temporarySignedRoute('accept-invite',
            86400, // expiration 1 day
            compact('email', 'permissions'));
            
        $sender = Auth::user()->getFIO();

        Notification::route('mail', $email)->notify(new UserInvite($link, $sender));

        $this->addInvitationData($email);

    }

    public function acceptInvite(string $email, int $user_id) {
        $rec = UserInvitation::where('email', $email)->first();
        if ($rec) {
            $rec->fill([
                'accepted' => true,
                'accepted_at' => Date::now(),
                'user_id' => $user_id
            ]);
            $rec->save();
        }
    }


    // add data to the table
    protected function addInvitationData(string $email) {
        UserInvitation::firstOrCreate([
            'email' => $email
        ]);
    }

    protected function prineInvitationData() {
        UserInvitation::where('accepted', true)->delete();
    }

}
