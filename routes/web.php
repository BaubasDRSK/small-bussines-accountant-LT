<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

//settings route
Route::get('/settings', [CompanyController::class, 'index'])->middleware(['auth', 'verified'])->name('settings');
Route::post('/settigs/store', [CompanyController::class, 'store'])->name('settings-store');

//customer routes
Route::prefix('customers')->name('customers-')->group(function () {
    Route::get('customers', [CustomerController::class,'index'])->name('list');
    Route::post('customers2', [CustomerController::class,'list'])->name('listf');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
