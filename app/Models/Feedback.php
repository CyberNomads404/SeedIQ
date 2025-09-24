<?php

namespace App\Models;

use App\Enums\FeedbackTypeEnum;

class Feedback extends BaseModel
{
    protected $table = 'feedbacks';
    protected $fillable = [
        'user_id',
        'type',
        'message',
        'attachment',
        'mime_type',
        'page',
        'device',
        'app_version',
        'user_agent',
        'ip_address',
        'read_at',
    ];

    protected $casts = [
        'type' => FeedbackTypeEnum::class,
        'read_at' => 'datetime',
    ];

    protected $appends = [
        'type_label',
        'attachment_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function getTypeLabelAttribute(): string
    {
        return $this->type->label();
    }

    public function getAttachmentUrlAttribute()
    {
        if (!$this->attachment) {
            return null;
        }

        $baseUrl = config('filesystems.disks.s3.url', env('AWS_URL', 'https://your-default-s3-url.com'));
        return rtrim($baseUrl, '/') . '/' . ltrim($this->attachment, '/');
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function switchMarkAsRead(): void
    {
        if ($this->isRead()) {
            $this->update(['read_at' => null]);
        } else {
            $this->markAsRead();
        }
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }
}
