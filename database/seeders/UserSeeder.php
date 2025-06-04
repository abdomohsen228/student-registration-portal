<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         User::factory()->count(1)->create();
        
        //  User::create([
        //      'full_name' => 'Test User',
        //      'user_name' => 'testuser',
        //      'phone' => '1234567890',
        //      'whatsapp_number' => '1234567890',
        //      'address' => '123 Test Street',
        //      'email' => 'test@example.com',
        //      'password' => bcrypt('password'),
        //  ]);
    }
}
