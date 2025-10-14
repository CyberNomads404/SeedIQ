<?php

namespace App\Models;

use App\Enums\StatusTypeEnum;
use Illuminate\Database\Eloquent\Model;

class Classification extends BaseSoftDeleteModel
{
    protected $fillable = [
        'external_id',
        'user_id',
        'category_id',
        'status',
        'file',
        'message',
    ];

    protected $appends = [
        'category_for_display',
        'file_url',
        'status_label',
        'user_for_display',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function getUserForDisplayAttribute() {
        return $this->user();
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }

    public function getCategoryForDisplayAttribute(): string
    {
        return $this->category();
    }

    public function getFileUrlAttribute()
    {
        $baseUrl = config('filesystems.disks.s3.url', env('AWS_URL', 'https://your-default-s3-url.com'));
        return rtrim($baseUrl, '/') . '/' . ltrim($this->file, '/');
    }

    public function getStatusLabelAttribute()
    {
        return StatusTypeEnum::getLabel($this->status) ?? $this->status;
    }

    public function result()
    {
        return $this->hasOne(ClassificationResult::class);
    }
}
