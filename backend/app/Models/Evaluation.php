<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
        'supplier_id',
        'evaluator_id',
        'total_score',
        'period',
        'status',
        'comments',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'total_score' => 'float',
        'approved_at' => 'datetime',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function evaluation_scores()
    {
        return $this->hasMany(EvaluationScore::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
