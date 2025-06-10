<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewUserRegistered;


class UserController extends Controller
{
    public function createNewUser(Request $request)
    {
        try {

            // Set locale from request
            $locale = $request->input('locale', config('app.locale')); // Default to app.locale
            if (in_array($locale, ['en', 'ar'])) {
                App::setLocale($locale);
            }

            // Store locale in session for redirect
            Session::put('locale', $locale);
            // printf("Creating new user with data: %s\n", json_encode($request->all()));

            $validatedData = $this->validateUser($request);

            if ($request->hasFile('user_image')) {
                $validatedData['user_image'] = $this->uploadUserImage($request->file('user_image'), $validatedData['user_name']);
            }

            $user = $this->createUser($validatedData);

            Mail::to('salmasarhan676@gmail.com')->send(new \App\Mail\NewUserRegistered($user));
            // printf("User created successfully: %s\n", json_encode($user));
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
            ], 201);
        } catch (ValidationException $e) {
            // print_r($e->errors());

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

            // Session::flash('errors', $e->errors());

            //return redirect()->back()->withInput();

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User creation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        $user = User::where('email', $credentials['email'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
        ]);
    }
    protected function validateUser(Request $request): array
    {
        return $request->validate([
            'full_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z-\' ]*$/',
            ],
            'user_name' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'regex:/^[a-zA-Z0-9_-]+$/',
                'unique:users,user_name'
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^[0-9]*$/',
                'unique:users,phone',
            ],
            'whatsapp_number' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9]*$/',
            ],
            'address' => [
                'nullable',
                'string',
                'max:500',
            ],
            'email' => [
                'required',
                'email',
                'max:100',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/',
            ],
            'user_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,gif',
                'max:2048',
            ],
        ], [
            'full_name.regex' => 'Only letters, spaces, hyphens, and apostrophes are allowed.',
            'user_name.regex' => 'Only letters and numbers are allowed.',
            'phone.regex' => 'Only numbers are allowed.',
            'whatsapp_number.regex' => 'Only numbers are allowed.',
            'password.regex' => 'Password must contain at least one number and one special character.',
        ]);
    }

    protected function uploadUserImage($imageFile, $username): string
    {
        try {
            $extension = $imageFile->getClientOriginalExtension();
            $filename = $username . '_' . Str::random(10) . '.' . $extension;

            $path = $imageFile->storeAs('profile_images', $filename, 'public');

            return Storage::url($path);
        } catch (\Exception $e) {
            throw new \Exception('Failed to upload image: ' . $e->getMessage());
        }
    }

    public function checkUsername(Request $request)
    {
        $request->validate([
            'username' => 'required|string|min:3|max:20|regex:/^[a-zA-Z0-9_-]+$/'
        ]);

        $exists = User::where('user_name', $request->username)->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'Username already taken' : 'Username available'
        ]);
    }

    protected function createUser(array $validatedData): User
    {
        try {
            return User::create([
                'full_name' => $validatedData['full_name'],
                'user_name' => $validatedData['user_name'],
                'phone' => $validatedData['phone'],
                'whatsapp_number' => $validatedData['whatsapp_number'] ?? null,
                'address' => $validatedData['address'] ?? null,
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'user_image' => $validatedData['user_image'] ?? null,
            ]);
        } catch (\Exception $e) {
            // Clean up uploaded image if user creation fails
            if (isset($validatedData['user_image'])) {
                Storage::delete($validatedData['user_image']);
            }
            throw new \Exception('Failed to create user: ' . $e->getMessage());
        }
    }
}
