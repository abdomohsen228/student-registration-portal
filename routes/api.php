<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WhatsAppValidationController;

Route::post('/auth/register', [UserController::class, 'createNewUser']);

Route::post('/auth/login', [UserController::class, 'login']);

Route::post('/validate-whatsapp', [WhatsAppValidationController::class, 'validateNumber']);