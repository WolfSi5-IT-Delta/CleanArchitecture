<?php

namespace App\Models;

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
        $head = User::where('id', $this->head)->select('id','name', 'last_name')->first()->toArray();
        if (!is_null($head)) {
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

}
