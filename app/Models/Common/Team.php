<?php

namespace App\Models\Common;

use App\Models\User;
use App\Packages\Common\Application\Events\EntityCreated;
use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Domain\PermissionDTO;
use App\Packages\Common\Infrastructure\Services\AuthorisationService;
use Lauthz\Facades\Enforcer;
use Chelout\RelationshipEvents\Concerns\HasBelongsToManyEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Team extends Model
{
    use HasFactory, HasBelongsToManyEvents;

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

        static::created(function ($item) {
            EntityCreated::dispatch(new PermissionDTO(type:'T', id:$item->id, name:$item->name));
        });

        static::belongsToManySynced(function ($relation, $parent, $ids) {
            if ($relation === 'users') {
                $role = "T$parent->id";
                // clear role
                collect(Enforcer::GetUsersForRole($role))
                    ->each(fn ($e) => Enforcer::deleteRoleForUser($e, $role));
                // set users for role
                $arr = collect($ids)
                    ->map(fn ($e) => "U$e")
                    ->each(fn ($e) => Enforcer::addRoleForUser($e, $role));
                Log::info("Roles has been synced to user $role - {$arr->toJson()}");
            }
        });
    }
}
