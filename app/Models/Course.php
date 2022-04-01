<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\SortScope;
use App\Models\Scopes\ActiveScope;

class Course extends Model
{
    use HasFactory;

    protected $table = 'learn_courses';

    protected $fillable = [
        'name',
        'active',
        'sort',
        'description',
        'image',
        'course_group_id',
        'options',
    ];

    protected $appends = [
        'progress'
    ];

    //note: now getProgressAttribute() counts progress all lessons even lesson is hidden

    public function getProgressAttribute()
    {
        $all_lessons = $this->lessons()->with('journalLessonForCurrentUser')->get();
        $done = 0;
        $all = 0;
        $percent = 0;
        foreach ($all_lessons as $lesson) {
            if(count($lesson->journalLessonForCurrentUser()->where('status', 'done')->get())) {
                $done++;
            }
            $all++;
        }
        if ($all !== 0 && $done !== 0) 
        {
            $percent = intval(floatval($done / $all) * 100);
        }
        return $percent;
    }

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'learn_course_lesson')->orderBy('order')->withPivot('order', 'id')->withTimestamps();
    }

    protected static function booted()
    {
        static::addGlobalScope(new ActiveScope());
        static::addGlobalScope(new SortScope());
    }
}
