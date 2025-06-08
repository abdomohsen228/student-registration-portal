<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Models\User;

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


// Add this to your routes/web.php
// Route::get('/check-username', function(Request $request) {
//     $exists = User::where('user_name', $request->username)->exists();
//     printf("Checking username '%s': %s\n", $request->username, $exists ? 'exists' : 'does not exist');
//     return response()->json(['available' => !$exists]);
// })->middleware('web');
// routes/web.php
Route::post('/ajax/check-username', [UserController::class, 'checkUsername'])
    ->name('ajax.checkUsername');