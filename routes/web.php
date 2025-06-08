<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\WhatsAppValidatorController;

Route::get('/', function () {
    return redirect('/register');
});
Route::fallback(function () {
    return redirect('/register');
});
// Route::get('/login', function () {
//     return view('auth.login');
// })->name('login.view');

// Route::post('/login', [UserController::class, 'login'])->name('login');

Route::get('/register', function () {
    return view('index');
})->name('register.view');

Route::post('/register', [UserController::class, 'createNewUser'])->name('register');

Route::post('/api/validate-whatsapp', [WhatsAppValidatorController::class, 'validateNumber'])
->middleware('throttle:5,1'); // 5 requests per minute;

Route::post('/ajax/check-username', [UserController::class, 'checkUsername'])
    ->name('ajax.checkUsername');