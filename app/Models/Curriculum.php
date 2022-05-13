<?php

namespace App\Models;

use App\Packages\Common\Application\Events\ObjectDeleted;
use App\Packages\Common\Application\Events\EntityCreated;
use App\Packages\Common\Application\Events\EntityDeleted;
use App\Packages\Common\Domain\PermissionDTO;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Lauthz\Facades\Enforcer;

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
        'progress',
        'type'
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'learn_course_curriculum')->orderBy('order')->withPivot('order', 'id')->withTimestamps();
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
        return $total == 0 ? 0 : intval(floatval($course_progress / $total) * 100);
    }

    protected static function booted()
    {
        static::deleted(function ($item) {
            EntityDeleted::dispatch(new PermissionDTO(type:'LP', id:$item->id, name:$item->name));
        });
    }

}
