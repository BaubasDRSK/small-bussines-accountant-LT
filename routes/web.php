<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Models\Invoice;

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
    return Inertia::render('Dashboard',[
        'customerDashboard' => route('customers-dashboard'),
        'invoiceDashboard' => route('invoices-dashboard'),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

//settings route
Route::get('/settings', [CompanyController::class, 'index'])->middleware(['auth', 'verified'])->name('settings');
Route::post('/settigs/store', [CompanyController::class, 'store'])->middleware(['auth', 'verified'])->name('settings-store');

//Client routes
Route::prefix('customers')->middleware(['auth', 'verified'])->name('customers-')->group(function () {
    Route::get('/', [CustomerController::class,'index'])->name('index');
    Route::post('/list', [CustomerController::class,'list'])->name('list');
    Route::get('/new', [CustomerController::class, 'create'])->name('create');
    Route::post('/store', [CustomerController::class,'store'])->name('store');
    Route::get('/show/{customer}', [CustomerController::class,'show'])->name('show');
    Route::post('/update/{customer}', [CustomerController::class, 'update'])->name('update');
    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('dashboard');


});

//Invoices routes
Route::prefix('invoices')->middleware(['auth', 'verified'])->name('invoices-')->group(function () {
    Route::get('/',[InvoiceController::class, 'index'])->name('index');
    Route::post('/list', [InvoiceController::class,'list'])->name('list');
    Route::post('/update', [InvoiceController::class,'update'])->name('update');
    Route::get('/show/{invoice}', [InvoiceController::class,'show'])->name('show');
    Route::get('/dashboard', [InvoiceController::class, 'dashboard'])->name('dashboard');
    Route::get('/new/{invoice}', [InvoiceController::class, 'create'])->name('create');
    Route::post('/store', [InvoiceController::class,'store'])->name('store');
});

//Products routes
Route::prefix('products')->middleware(['auth', 'verified'])->name('products-')->group(function () {
    Route::get('/',[ProductController::class, 'index'])->name('index');
    Route::post('/list', [ProductController::class,'list'])->name('list');
    Route::get('/new', [ProductController::class, 'create'])->name('create');
    Route::post('/store', [ProductController::class,'store'])->name('store');
    Route::get('/show/{product}', [ProductController::class,'show'])->name('show');
    Route::get('/edit/{product}', [ProductController::class, 'edit'])->name('edit');
    Route::put('/update/{product}', [ProductController::class, 'update'])->name('update');
    Route::delete('/delete/{product}', [ProductController::class, 'destroy'])->name('delete');
});

//Expenses routes
Route::prefix('expenses')->middleware(['auth', 'verified'])->name('expenses-')->group(function () {
    Route::get('/',[ExpenseController::class, 'index'])->name('index');
    Route::post('/list', [ExpenseController::class,'list'])->name('list');
    Route::post('/update', [ExpenseController::class,'update'])->name('update');
    Route::get('/show/{expense}', [ExpenseController::class,'show'])->name('show');
    Route::get('/dashboard', [ExpenseController::class, 'dashboard'])->name('dashboard');
    Route::get('/new/{expense}', [ExpenseController::class, 'create'])->name('create');
    Route::post('/store', [ExpenseController::class,'store'])->name('store');
    Route::get('/{expense}/download', [ExpenseController::class, 'downloadAttachment'])->name('download');
});



// Assuming you have a route group for authenticated users and correct namespace


// Route::get('/products/list', [ProductController::class, 'list'])->name('products-list');
// // Use Route::resource for the standard CRUD operations
// Route::resource('products', ProductController::class)
//     ->names([
//         'index' => 'products-index',
//         'create' => 'products-create',
//         'store' => 'products-store',
//         'show' => 'products-show',
//         'edit' => 'products-edit',
//         'update' => 'products-update',
//         'destroy' => 'products-destroy',
//     ]);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
