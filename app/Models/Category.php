<?php

namespace App\Models;

class Category extends BaseSoftDeleteModel
{
    protected $fillable = [
        'external_id',
        'name',
        'tag',
        'icon',
    ];

    protected $appends = [
        'icon_url',
    ];

    public function classifications()
    {
        return $this->hasMany(Classification::class);
    }

    public function getIconUrlAttribute()
    {
        if (!$this->icon) {
            return null;
        }

        $baseUrl = config('filesystems.disks.s3.url', env('AWS_URL', 'https://your-default-s3-url.com'));
        return rtrim($baseUrl, '/') . '/' . ltrim($this->icon, '/');
    }
}
