<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'user_name' => 'required|string|max:255|unique:users,user_name',
            'phone' => 'required|string|max:20',
            'whatsapp_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'user_image' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'user_name' => $request->user_name,
            'phone' => $request->phone,
            'whatsapp_number' => $request->whatsapp_number,
            'address' => $request->address,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_image' => $request->user_image,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }
}
