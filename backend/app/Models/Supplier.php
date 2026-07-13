<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'registration_number',
        'category',
        'status',
        'email',
        'phone',
        'address',
    ];

    protected $appends = [
        'current_score',
    ];

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function latestApprovedEvaluation()
    {
        return $this->hasOne(Evaluation::class)->ofMany([
            'period' => 'max',
            'id' => 'max',
        ], function ($query) {
            $query->where('status', 'approved');
        });
    }

    public function getCurrentScoreAttribute()
    {
        if ($this->relationLoaded('latestApprovedEvaluation') && $this->latestApprovedEvaluation) {
            return round($this->latestApprovedEvaluation->total_score);
        }
        return null;
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
