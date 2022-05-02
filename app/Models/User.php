<?php

namespace App\Models;

use App\Packages\Common\Application\Events\PermissionDeleted;
use App\Packages\Common\Domain\PermissionDTO;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'phone',
        'avatar',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'type'
    ];

    /**
     * Define casbin type.
     *
     * @return string
     */
    public function getTypeAttribute()
    {
        return 'U';
    }

    public function portals()
    {
        return $this->belongsToMany(Portal::class);
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class);
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleted(function ($item) {
            PermissionDeleted::dispatch(new PermissionDTO(type:'U', id:$item->id, name:$item->name));
        });
    }
}
