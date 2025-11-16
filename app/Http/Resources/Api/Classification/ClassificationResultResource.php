<?php

namespace App\Http\Resources\Api\Classification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassificationResultResource extends JsonResource
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
            'payload' => $this->payload,
            'burned' => $this->burned,
            'greenish' => $this->greenish,
            'good_grains' => $this->good_grains,
            'created_at' => $this->created_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at,
            'updated_at_human' => $this->updated_at->diffForHumans(),
        ];
    }
}
