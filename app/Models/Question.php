<?php

namespace App\Models;

use App\Models\Scopes\SortScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $table = 'learn_questions';

    protected $fillable = [
        'name',
        'hint',
        'active',
        'type',
        'point',
        'sort',
        'lesson_id'
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    protected static function booted()
    {
        static::addGlobalScope(new SortScope());
    }
}
