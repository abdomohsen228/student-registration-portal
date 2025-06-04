<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

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
