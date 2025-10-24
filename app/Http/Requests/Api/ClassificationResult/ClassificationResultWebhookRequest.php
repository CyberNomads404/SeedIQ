<?php

namespace App\Http\Requests\Api\ClassificationResult;

use App\Http\Requests\Api\Traits\CrudRequest;
use App\Models\ClassificationResult;
use App\Enums\StatusTypeEnum;

class ClassificationResultWebhookRequest extends CrudRequest
{
    protected $type = ClassificationResult::class;

    /**
     * Rules when editing resource.
     *
     * @return array
     */
    protected function editRules()
    {
        $rules = [

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
        return [
            'status' => ['required', 'boolean'],
            'message' => ['required', 'string'],
            'data' => ['required', 'array'],
            'data.job_id' => ['required', 'string'],
            'data.status' => ['required', 'string'],
            'data.payload' => ['required', 'array'],
            'data.payload.external_id' => ['required', 'string'],
            'data.result' => ['required', 'array'],
        ];
    }
}
