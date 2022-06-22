<?php

namespace App\Models;

use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Domain\PermissionDTO;
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
        'progress',
        'type'
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

    /**
     * Define casbin type.
     *
     * @return string
     */
    public function getTypeAttribute()
    {
        return 'P';
    }

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'learn_course_lesson')->orderBy('order')->withPivot('order', 'id')->withTimestamps();
    }

    public function group()
    {
        return $this->hasOne(CourseGroup::class, 'id', 'course_group_id');
    }

    protected static function booted()
    {
        static::addGlobalScope(new SortScope());

        static::deleted(function ($item) {
            EntityDeleted::dispatch(new PermissionDTO(type:'LC', id:$item->id, name:$item->name));
        });
    }
}
