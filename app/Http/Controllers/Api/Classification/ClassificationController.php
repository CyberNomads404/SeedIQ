<?php

namespace App\Http\Controllers\Api\Classification;

use App\Enums\ClassificationTypeEnum;
use App\Enums\StatusTypeEnum;
use App\Http\Controllers\Api\AuthController;
use App\Http\Requests\Api\Classification\ClassificationRequest;
use App\Http\Resources\Api\Classification\ClassificationResource;
use App\Http\Resources\Api\Meta\MetaResource;
use App\Models\Classification;

class ClassificationController extends AuthController
{
    protected $model = Classification::class;

    public function index() {
        $perPage = request()->get('per_page', 10);
        $sortColumn = request()->get('sort_column', 'name');
        $sortDirection = request()->get('sort_direction', 'asc');

        $filterCategoriesExternalId = request()->get('filter_categories_external_id', '');
        $filterStatus = request()->get('filter_status', '');

        $allowedSortColumns = ['name', 'created_at', 'updated_at'];
        if (!in_array($sortColumn, $allowedSortColumns)) {
            $sortColumn = 'name';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
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
            ->orderBy($sortColumn, $sortDirection)
            ->paginate($perPage);

        return $this->responseMessage('success', trans('responses.classification.list_success'), 200, [
            'classifications' => ClassificationResource::collection($classifications),
            'meta' => new MetaResource($classifications),
        ]);
    }

    public function store(ClassificationRequest $request) {
        $validated = $request->validated();

        $validated['status'] = StatusTypeEnum::REGISTERED;
        $validated['file'] = uploadFile($validated['file'], 'classifications', 's3');

        $classification = $this->model::create($validated);

        return $this->responseMessage('success', trans('responses.classification.create_success'),200, []);
    }

    public function show(string $externalId) {
        $classification = $this->findBy(new $this->model, 'external_id', $externalId)->load('result');

        return $this->responseMessage('success', trans('responses.classification.get_success'), 200, new ClassificationResource($classification));
    }
}
