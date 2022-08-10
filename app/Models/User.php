<?php

namespace App\Models;

use App\Packages\Common\Application\Events\EntityCreated;
use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Domain\PermissionDTO;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Lauthz\Facades\Enforcer;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

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
        'status'
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
        'type',
        'admin'
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

    public function getAdminAttribute()
    {
        return Enforcer::HasRoleForUser("U$this->id", 'ADMIN');
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class);
    }

    public function getFIO(): string {
        return trim($this->name . ' ' . $this->last_name);
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleted(function ($item) {
            EntityDeleted::dispatch(new PermissionDTO(type:'U', id:$item->id, name:$item->name));
        });

        static::created(function ($item) {
            EntityCreated::dispatch(new PermissionDTO(type:'U', id:$item->id, name:$item->name));
        });
    }
}
