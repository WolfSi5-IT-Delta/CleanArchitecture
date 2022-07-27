<?php

namespace App\Packages\Common\Application\Services;

use App\Models\Common\UserInvitation;
use App\Notifications\UserInvite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

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

        $this->addInvitationData($email, $permissions);

    }

    // resend invitation
    public function resendInvite(int $id) {
        $rec = UserInvitation::find($id);
        $this->sendInvite($rec->email, json_decode($rec->data));
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


    // add data to the table, replace prev record
    protected function addInvitationData(string $email, array $permissions) {
        UserInvitation::firstOrCreate([
            'email' => $email
        ])->update([
            'data' => json_encode($permissions),
            'expires' => Date::now()->addSeconds(86400)
        ]);
    }

    protected function pruneInvitationData() {
        UserInvitation::where('accepted', true)->delete();
    }

}
