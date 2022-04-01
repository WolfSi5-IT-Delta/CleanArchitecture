<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearnCourseLesson extends Model
{
    use HasFactory;

    protected $table = 'learn_course_lesson';

    protected $fillable = [
        'order'
    ];

    public function course()
    {
        return $this->hasMany(Course::class);
    }

    public function lesson()
    {
        return $this->hasMany(Lesson::class);
    }
}
