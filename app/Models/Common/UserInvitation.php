<?php

namespace App\Models\Common;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;

class UserInvitation extends Model
{
    use HasFactory;

    protected $table = 'user_invitations';

    protected $fillable = [
        'email',
        'user_id',
        'expires',
        'data',
        'accepted',
        'accepted_at',
    ];

    protected $appends = [
        'expired'
    ];

    public function getExpiredAttribute()
    {
        if (!$this->expires) return true;
        $expires = Date::createFromFormat('Y-m-d H:i:s', $this->expires);
        return $expires->lt(Date::now());
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
