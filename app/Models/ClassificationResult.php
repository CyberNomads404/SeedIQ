<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassificationResult extends BaseSoftDeleteModel
{
    protected $fillable = [
        'external_id',
        'classification_id',
        'payload',
        'good',
        'bad_detection',
        'unknown',
        'burned',
        'greenish',
        'small',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }

    public function getGoodAttribute()
    {
        return $this->good ?? $this->payload['data']['result']['good'] ?? null;
    }

    public function getBadDetectionAttribute()
    {
        return $this->bad_detection ?? $this->payload['data']['result']['bad_detection'] ?? null;
    }

    public function getUnknownAttribute()
    {
        return $this->unknown ?? $this->payload['data']['result']['unknown'] ?? null;
    }

    public function getBurnedAttribute()
    {
        return $this->burned ?? $this->payload['data']['result']['burned'] ?? null;
    }

    public function getGreenishAttribute()
    {
        return $this->greenish ?? $this->payload['data']['result']['greenish'] ?? null;
    }

    public function getSmallAttribute()
    {
        return $this->small ?? $this->payload['data']['result']['small'] ?? null;
    }
}

