<?php

namespace App\Http\Controllers\Api\Feedback;

use App\Enums\FeedbackTypeEnum;
use App\Http\Controllers\Api\AuthController;
use App\Http\Requests\Api\Feedback\FeedbackRequest;
use App\Models\Feedback;

class FeedbackController extends AuthController
{
    protected $model = Feedback::class;

    public function store(FeedbackRequest $request)
    {
        $data = $request->validated();

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = uploadFile($request->file('attachment'), 'feedbacks', 's3');
        }

        $this->model::create([
            'user_id' => $this->authUser?->id,
            'type' => $data['type'],
            'message' => $data['message'],
            'attachment' => $attachmentPath,
            'mime_type' => $request->file('attachment')?->getMimeType(),
            'page' => $data['page'] ?? null,
            'device' => $data['device'] ?? null,
            'app_version' => $data['app_version'] ?? null,
            'user_agent' => $data['user_agent'] ?? null,
            'ip_address' => request()->ip(),
        ]);

        return $this->responseMessage('success', trans('responses.feedback.success'));
    }

    public function getTypes()
    {
        $types = FeedbackTypeEnum::options();

        return $this->responseMessage('success', trans('responses.feedback.get_types_success'), 200, [
            'types' => $types,
        ]);
    }
}
