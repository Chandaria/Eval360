<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\EvaluationCriteriaController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\ContractController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('evaluation-criteria', [EvaluationCriteriaController::class, 'index']);
    
    // Suppliers
    Route::get('suppliers', [SupplierController::class, 'index']);
    Route::get('suppliers/{supplier}', [SupplierController::class, 'show']);
    Route::middleware('role:admin,procurement_officer')->group(function () {
        Route::post('suppliers', [SupplierController::class, 'store']);
        Route::put('suppliers/{supplier}', [SupplierController::class, 'update']);
        Route::patch('suppliers/{supplier}', [SupplierController::class, 'update']);
    });
    Route::middleware('role:admin')->group(function () {
        Route::delete('suppliers/{supplier}', [SupplierController::class, 'destroy']);
    });

    // Evaluations
    Route::get('evaluations/pending', [ManagerDashboardController::class, 'pending'])->middleware('role:admin,procurement_manager');
    Route::post('evaluations/{evaluation}/approve', [EvaluationController::class, 'approve'])->middleware('role:admin,procurement_manager');
    
    Route::get('suppliers/{supplier}/evaluations', [EvaluationController::class, 'index']);
    Route::middleware('role:admin,procurement_officer')->group(function () {
        Route::post('suppliers/{supplier}/evaluations', [EvaluationController::class, 'store']);
    });

    // Contracts
    Route::get('contracts', [ContractController::class, 'index']);
    Route::get('contracts/{contract}', [ContractController::class, 'show']);
    Route::middleware('role:admin,procurement_officer')->group(function () {
        Route::post('contracts', [ContractController::class, 'store']);
        Route::put('contracts/{contract}', [ContractController::class, 'update']);
        Route::patch('contracts/{contract}', [ContractController::class, 'update']);
    });
    Route::middleware('role:admin')->group(function () {
        Route::delete('contracts/{contract}', [ContractController::class, 'destroy']);
    });
    
    // Dashboards
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);
    Route::get('dashboard/manager', [ManagerDashboardController::class, 'index'])->middleware('role:admin,procurement_manager');
    Route::get('admin/dashboard', [\App\Http\Controllers\AdminDashboardController::class, 'index'])->middleware('role:admin');
    
    // Users
    Route::middleware('role:admin')->group(function () {
        Route::get('users', [\App\Http\Controllers\UserController::class, 'index']);
        Route::patch('users/{user}', [\App\Http\Controllers\UserController::class, 'update']);
    });
});
