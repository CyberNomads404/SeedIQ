<?php

namespace App\Http\Controllers\Api\Classification;

use App\Enums\ClassificationTypeEnum;
use App\Enums\StatusTypeEnum;
use App\Http\Controllers\Api\AuthController;
use App\Http\Requests\Api\Classification\ClassificationRequest;
use App\Http\Requests\Api\ClassificationResult\ClassificationResultWebhookRequest;
use App\Http\Resources\Api\Classification\ClassificationResource;
use App\Http\Resources\Api\Meta\MetaResource;
use App\Jobs\SendClassificationForAnalyze;
use App\Models\Category;
use App\Models\Classification;
use Auth;

class ClassificationController extends AuthController
{
    protected $model = Classification::class;

    public function index()
    {
        $perPage = request()->get('per_page', 10);
        $sortColumn = request()->get('sort_column', 'created_at');
        $sortDirection = request()->get('sort_direction', 'desc');

        $filterCategoriesExternalId = request()->get('filter_categories_external_id', '');
        $filterStatus = request()->get('filter_status', '');

        $allowedSortColumns = ['status', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'created_at';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $classifications = $this->model::query()
            ->when($filterCategoriesExternalId, function ($query) use ($filterCategoriesExternalId) {
                $query->whereHas('categories', function ($q) use ($filterCategoriesExternalId) {
                    $q->where('external_id', $filterCategoriesExternalId);
                });
            })
            ->when($filterStatus, function ($query) use ($filterStatus) {
                $query->where('status', $filterStatus);
            })
            ->where('user_id', $this->authUser->id)
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        return $this->responseMessage('success', trans('responses.classification.list_success'), 200, [
            'classifications' => ClassificationResource::collection($classifications),
            'meta' => new MetaResource($classifications),
        ]);
    }

    public function store(ClassificationRequest $request)
    {
        $validated = $request->validated();

        $validated['user_id'] = $this->authUser->id;
        $validated['category_id'] = $this->findBy(new Category, $validated['category_external_id'], 'external_id')->id;
        $validated['status'] = StatusTypeEnum::REGISTERED;
        $validated['file'] = uploadFile($validated['file'], 'classifications', 's3');

        $classification = $this->model::create($validated);

        SendClassificationForAnalyze::dispatch($classification);

        return $this->responseMessage('success', trans('responses.classification.create_success'), 200, []);
    }

    public function show(string $externalId)
    {
        $classification = Classification::where('external_id', $externalId)->first();

        if (!$classification) {
            return $this->responseMessage('error', trans('responses.error.classification_not_found'), 404, []);
        }

        $classification->load('result');

        return $this->responseMessage('success', trans('responses.classification.get_success'), 200, new ClassificationResource($classification));
    }

    public function set_result(ClassificationResultWebhookRequest $request) {
        $validated = $request->validated();

        $classification = Classification::where('external_id', $validated['data']['payload']['external_id'])->first();

        if (!$classification) {
            return $this->responseMessage('error', trans('responses.error.classification_not_found'), 404, []);
        }

        $classification->result()->updateOrCreate(
            ['classification_id' => $classification->id],
            [
                'payload' => $validated,
            ]
        );

        $classification->markAs($validated['data']['status'] === "COMPLETED" ? StatusTypeEnum::COMPLETED->value : StatusTypeEnum::FAILED->value);

        return $this->responseMessage('success', trans('responses.classification_result.set_result_success'), 202);
    }
}
