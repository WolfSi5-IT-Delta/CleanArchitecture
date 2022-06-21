<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseGroup extends Model
{
    use HasFactory;

    protected $table = 'learn_course_group';

    protected $fillable = [
        'name',
        'active',
        'description'
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
