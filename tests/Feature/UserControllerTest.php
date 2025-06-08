<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_user_with_image()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg');

        $payload = [
            'full_name' => 'John Doe',
            'user_name' => 'john_doe123',
            'phone' => '0123456789',
            'whatsapp_number' => '0123456789',
            'address' => '123 Main St',
            'email' => 'john@example.com',
            'password' => 'Secure@123',
            'user_image' => $file,
        ];

        // Send POST request
        $response = $this->postJson('/register', $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'user' => [
                'id',
                'full_name',
                'user_name',
                'phone',
                'whatsapp_number',
                'address',
                'email',
                'user_image',
                'created_at',
                'updated_at',
            ],
        ]);

        $userImageUrl = User::first()->user_image;
        $userImagePath = str_replace('/storage/', '', $userImageUrl);

        Storage::disk('public')->assertExists($userImagePath);

    }

    public function test_fails_with_invalid_user_data()
    {
        $payload = [
            'full_name' => '',
            'user_name' => 'ab',
            'phone' => 'abc123',
            'email' => 'not-an-email',
            'password' => '123',
        ];

        $response = $this->postJson('/register', $payload);

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'message',
            'errors',
        ]);
    }

    public function test_image_is_deleted_on_user_creation_failure()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg');

        User::factory()->create([
            'user_name' => 'john_doe123',
            'email' => 'existing@example.com',
            'phone' => '0101010101'
        ]);

        $payload = [
            'full_name' => 'Jane Doe',
            'user_name' => 'john_doe123',
            'phone' => '0123456789',
            'email' => 'jane@example.com',
            'password' => 'Secure@123',
            'user_image' => $file,
        ];

        $response = $this->postJson('/register', $payload);

        $response->assertStatus(422); 
        Storage::disk('public')->assertMissing('profile_images');
    }
}
