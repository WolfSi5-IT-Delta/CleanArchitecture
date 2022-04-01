<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

    protected $table = 'learn_curriculums';

    protected $fillable = [
        'name',
        'active',
        'description'
    ];

    protected $appends = [
        'progress'
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'learn_course_curriculum')->orderBy('order')->withPivot('order', 'id')->withTimestamps();
    }

    // Note: now getProgressAttribute() counts progress even course is hidden

    public function getProgressAttribute()
    {
        $all_courses = $this->courses()->get();
        $total = 0;
        $course_progress = 0;
        foreach ($all_courses as $course)
        {
            $course_progress += $course->progress;
            $total += 100;
        }
        return intval(floatval($course_progress / $total) * 100);
    }

}
