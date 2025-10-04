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
            ['email' => 'support@seed-iq.com'],
            [
                'external_id' => Str::uuid()->toString(),
                'name' => 'Seed IQ - Suporte',
                'password' => bcrypt('support@seed-iq.com'),
                'email_verified_at' => now(),
            ]
        );
        $support->assignRole([ActiveRoleUserEnum::SUPPORT]);

        $admin = User::updateOrCreate(
            ['email' => 'adm@seed-iq.com'],
            [
                'external_id' => Str::uuid()->toString(),
                'name' => 'Seed IQ - Admin',
                'password' => bcrypt('adm@seed-iq.com'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole([ActiveRoleUserEnum::ADMIN]);

        $client = User::updateOrCreate(
            ['email' => 'client@seed_iq.com'],
            [
                'external_id' => Str::uuid()->toString(),
                'name' => 'Seed IQ - Client',
                'password' => bcrypt('client@seed-iq.com'),
                'email_verified_at' => now(),
            ]
        );
        $client->assignRole([ActiveRoleUserEnum::OPERATOR]);
    }
}
