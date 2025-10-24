<?php

namespace Database\Seeders;

use App\Enums\ActiveRoleUserEnum;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::updateOrCreate(
            ['tag' => 'corn'],
            [
                'name' => "Milho",
                'external_id' => Str::uuid()->toString(),
                'icon' => 'categories/r0Mi3t3QGJe55ReYnSQSdeSbkxwpue7lvqpPZjNE.svg',
            ]
        );

        Category::updateOrCreate(
            ['tag' => 'soy'],
            [
                'name' => "Soja",
                'external_id' => Str::uuid()->toString(),
                'icon' => 'categories/EFT451trxOKZBbOSmM8saNAntFvU1ZHPCe6VuEAY.svg',
            ]
        );
    }
}
