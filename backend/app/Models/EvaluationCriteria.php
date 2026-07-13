<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationCriteria extends Model
{
    protected $table = 'evaluation_criteria';

    protected $fillable = [
        'name',
        'key',
        'weight',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'weight' => 'float',
    ];

    public function scores()
    {
        return $this->hasMany(EvaluationScore::class, 'criteria_id');
    }
}
