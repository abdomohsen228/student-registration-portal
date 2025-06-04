<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/auth/register', [UserController::class, 'createNewUser']);

Route::post('/auth/login', [UserController::class, 'login']);
