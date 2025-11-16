<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassificationResult extends BaseSoftDeleteModel
{
    protected $fillable = [
        'external_id',
        'classification_id',
        'payload',
        'burned',
        'greenish',
        'good_grains',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }
}

