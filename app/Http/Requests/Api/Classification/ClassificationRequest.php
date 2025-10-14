<?php

namespace App\Http\Requests\Api\Classification;

use App\Http\Requests\Api\Traits\CrudRequest;
use App\Models\Classification;
use App\Enums\StatusTypeEnum;

class ClassificationRequest extends CrudRequest
{
    protected $type = Classification::class;

    /**
     * Rules when editing resource.
     *
     * @return array
     */
    protected function editRules()
    {
        $rules = [
            'message' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
            'file' => [
                'sometimes',
                'required',
                'image',
                'mimes:jpeg,jpg,png,heic,heif',
                'max:5120',
            ],
            'category_external_id' => [
                'sometimes',
                'required',
                'exists:categories,external_id',
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
            'message' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'file' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,heic,heif',
                'max:5120',
            ],
            'category_external_id' => [
                'required',
                'exists:categories,external_id',
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
