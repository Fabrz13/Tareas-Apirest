<?php

use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/todos', [TaskController::class, 'index']);
Route::post('/todos', [TaskController::class, 'store']);
Route::patch('/todos/{id}', [TaskController::class, 'update']);
Route::delete('/todos/{id}', [TaskController::class, 'destroy']);

Route::get('/tasks/{id}/toggle', [TaskController::class, 'toggle']);
Route::get('/categories', [TaskController::class, 'categories']);
Route::get('/stats', [TaskController::class, 'stats']);