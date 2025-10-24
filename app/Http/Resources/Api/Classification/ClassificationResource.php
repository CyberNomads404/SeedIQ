<?php

namespace App\Http\Resources\Api\Classification;

use App\Http\Resources\Api\Category\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'external_id' => $this->external_id,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'message' => $this->message,
            'file_url' => $this->file_url,
            'category_for_display' => new CategoryResource($this->category_for_display),
            'result' => $this->whenLoaded('result', function () {
                return new ClassificationResultResource($this->result);
            }),
            'created_at' => $this->created_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at,
            'updated_at_human' => $this->updated_at->diffForHumans(),
        ];
    }
}
