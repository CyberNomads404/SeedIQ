<?php

namespace App\Enums;

use App\Enums\Traits\EnumTrait;

enum FeedbackTypeEnum: string
{
    use EnumTrait;

    case BUG = 'bug';
    case FEATURE_REQUEST = 'feature_request';
    case SUGGESTION = 'suggestion';
    case PRAISE = 'praise';
    case GENERAL = 'general';

    public function label(): string
    {
        return match ($this) {
            self::BUG => __('enum.feedback_types.bug'),
            self::FEATURE_REQUEST => __('enum.feedback_types.feature_request'),
            self::SUGGESTION => __('enum.feedback_types.suggestion'),
            self::PRAISE => __('enum.feedback_types.praise'),
            self::GENERAL => __('enum.feedback_types.general'),
            default => __('enum.feedback_types.unknown'),
        };
    }
}
