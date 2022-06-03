<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalLesson extends Model
{
    use HasFactory;

    protected $table = 'learn_journal_lessons';

    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'instructor_id',
        'answers',
        'status',
        'tries'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
