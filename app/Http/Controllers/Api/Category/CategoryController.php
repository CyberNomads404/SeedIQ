<?php

namespace App\Http\Controllers\Api\Category;

use App\Enums\CategoryTypeEnum;
use App\Http\Controllers\Api\AuthController;
use App\Http\Requests\Api\Category\CategoryRequest;
use App\Http\Resources\Api\Category\CategoryResource;
use App\Models\Category;

class CategoryController extends AuthController
{
    protected $model = Category::class;

    public function index() {
        $categories = Category::all();

        return $this->responseMessage('success', trans('responses.category.list_success'), 200, [
            'categories' => CategoryResource::collection($categories),
        ]);
    }
}
