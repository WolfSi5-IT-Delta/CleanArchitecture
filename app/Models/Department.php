<?php

namespace App\Models;

use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Domain\PermissionDTO;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'head',
        'parent'
    ];

    protected $appends = [
        'type',
        'head_name',
        'parent_name'
    ];

    /**
     * Define casbin type.
     *
     * @return string
     */
    public function getTypeAttribute()
    {
        return 'DM';
    }

    public function getHeadNameAttribute()
    {
        $head = User::where('id', $this->head)->select('id','name', 'last_name')->first();
        if (!is_null($head)) {
            $head = $head->toArray();
            return $head['name'] . ' ' . $head['last_name'];
        }
        return '';
    }

    public function getParentNameAttribute()
    {
        $parent = Department::where('id', $this->parent)->select('name')->first();
        if (!is_null($parent)) {
            return $parent->name;
        }
        return '';
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function hasChild() {
        return Department::where('parent', $this->id)->first() !== null;
    }
    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::deleted(function ($item) {
            EntityDeleted::dispatch(new PermissionDTO(type:'D', id:$item->id, name:$item->name));
        });
    }
}
