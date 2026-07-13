<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'supplier_id',
        'title',
        'start_date',
        'end_date',
        'value',
        'status',
        'sla_terms',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
