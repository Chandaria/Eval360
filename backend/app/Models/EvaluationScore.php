<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationScore extends Model
{
    protected $fillable = [
        'evaluation_id',
        'criteria_id',
        'raw_score',
        'weight_used',
        'weighted_score',
    ];

    protected $casts = [
        'raw_score' => 'float',
        'weight_used' => 'float',
        'weighted_score' => 'float',
    ];

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function criteria()
    {
        return $this->belongsTo(EvaluationCriteria::class, 'criteria_id');
    }
}
