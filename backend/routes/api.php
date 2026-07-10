<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ManagerDashboardController;

Route::apiResource('suppliers', SupplierController::class);
Route::get('dashboard/manager', [ManagerDashboardController::class, 'index']);
