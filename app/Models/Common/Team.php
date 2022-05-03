<?php

namespace App\Models\Common;

use App\Models\User;
use App\Packages\Common\Application\Events\EntityCreated;
use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Domain\PermissionDTO;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleted(function ($item) {
            EntityDeleted::dispatch(new PermissionDTO(type:'T', id:$item->id, name:$item->name));
        });

//        static::updated(function ($item) {
//            dd($item);
//            PermissionDeleted::dispatch(new PermissionDTO(type:'T', id:$item->id, name:$item->name));
//        });
//
        static::created(function ($item) {
            EntityCreated::dispatch(new PermissionDTO(type:'T', id:$item->id, name:$item->name));
        });

    }

}
