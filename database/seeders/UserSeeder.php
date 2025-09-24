<?php

namespace Database\Seeders;

use App\Enums\ActiveRoleUserEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $support = User::updateOrCreate(
            ['email' => 'support@base-laravel.com'],
            [
                'external_id' => Str::uuid()->toString(),
                'name' => 'Base Laravel - Suporte',
                'password' => bcrypt('support@base-laravel.com'),
                'email_verified_at' => now(),
            ]
        );
        $support->assignRole([ActiveRoleUserEnum::SUPPORT]);

        $admin = User::updateOrCreate(
            ['email' => 'adm@base-laravel.com'],
            [
                'external_id' => Str::uuid()->toString(),
                'name' => 'Base Laravel - Admin',
                'password' => bcrypt('adm@base-laravel.com'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole([ActiveRoleUserEnum::ADMIN]);

        $client = User::updateOrCreate(
            ['email' => 'client@base-laravel.com'],
            [
                'external_id' => Str::uuid()->toString(),
                'name' => 'Base Laravel - Client',
                'password' => bcrypt('client@base-laravel.com'),
                'email_verified_at' => now(),
            ]
        );
        $client->assignRole([ActiveRoleUserEnum::CLIENT]);
    }
}
