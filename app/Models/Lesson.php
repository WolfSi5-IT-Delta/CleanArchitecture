<?php

namespace App\Models;

use App\Models\Scopes\ActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\SortScope;
use Illuminate\Support\Facades\Auth;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'learn_lessons';

    protected $fillable = [
        'name',
        'active',
        'description',
        'detail_text',
        'options',
    ];

    public function journalLessonForCurrentUser()
    {
        return $this->hasOne(JournalLesson::class)->where('user_id', Auth::user()->id);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'learn_course_lesson')->orderBy('order')->withPivot('order', 'id')->withTimestamps();
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    protected static function booted()
    {
        static::addGlobalScope(new ActiveScope());
        static::addGlobalScope(new SortScope());
    }
}
