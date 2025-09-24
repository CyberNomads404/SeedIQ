<?php

namespace App\Http\Requests\Api\Feedback;

use App\Http\Requests\Api\Traits\CrudRequest;
use App\Models\Feedback;
use App\Enums\FeedbackTypeEnum;

class FeedbackRequest extends CrudRequest
{
    protected $type = Feedback::class;

    /**
     * Rules when editing resource.
     *
     * @return array
     */
    protected function editRules()
    {
        $rules = [
            'type' => [
                'required',
                'string',
                "in:" . implode(',', FeedbackTypeEnum::values()),
            ],
            'message' => [
                'required',
                'string',
                'max:1000',
            ],
            'attachment' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,mp3,wav,ogg,mp4,mov,avi,webm,mkv',
                'max:20480',
            ],
            'page' => [
                'nullable',
                'string',
                'max:255',
            ],
            'device' => [
                'nullable',
                'string',
            ],
            'app_version' => [
                'nullable',
                'string',
            ],
            'user_agent' => [
                'nullable',
                'string',
            ],
            'ip_address' => [
                'nullable',
                'ip',
            ],
            'read_at' => [
                'nullable',
                'date',
            ],
        ];

        return $rules;
    }

    /**
     * Rules when creating resource.
     *
     * @return array
     */
    protected function createRules()
    {
        $rules = [
            'type' => [
                'required',
                'string',
                "in:" . implode(',', FeedbackTypeEnum::values()),
            ],
            'message' => [
                'required',
                'string',
                'max:1000',
            ],
            'attachment' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,mp3,wav,ogg,mp4,mov,avi,webm,mkv',
                'max:20480',
            ],
            'page' => [
                'nullable',
                'string',
                'max:255',
            ],
            'device' => [
                'nullable',
                'string',
            ],
            'app_version' => [
                'nullable',
                'string',
            ],
            'user_agent' => [
                'nullable',
                'string',
            ],
            'ip_address' => [
                'nullable',
                'ip',
            ],
            'read_at' => [
                'nullable',
                'date',
            ],
        ];

        return $rules;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function baseRules()
    {
        return [];
    }
}
