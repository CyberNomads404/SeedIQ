<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassificationResult extends BaseSoftDeleteModel
{
    protected $fillable = [
        'external_id',
        'classification_id',
        'payload',
    ];

    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }
}

