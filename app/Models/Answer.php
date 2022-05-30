<?php

namespace App\Models;

use App\Models\Scopes\SortScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $table = 'learn_answers';

    protected $fillable = [
        'name',
        'active',
        'correct',
        'sort',
        'question_id'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'active' => 'boolean',
        'correct' => 'boolean',
        'sort' => 'integer',
    ];

    protected static function booted()
    {
        static::addGlobalScope(new SortScope());
    }
}
