<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Task::query();

            // Filtrar por estado
            if ($request->has('status')) {
                if ($request->status === 'completed') {
                    $query->completed();
                } elseif ($request->status === 'active') {
                    $query->pending();
                }
            }

            // Filtrar por prioridad
            if ($request->has('priority')) {
                $query->priority($request->priority);
            }

            // Filtrar por categoría
            if ($request->has('category')) {
                $query->category($request->category);
            }

            // Búsqueda
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('note', 'like', "%{$search}%");
                });
            }

            // Ordenar
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $tasks = $query->get();

            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener las tareas: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|min:3|max:255',
                'note' => 'nullable|string|max:1000',
                'priority' => 'required|in:low,medium,high',
                'category' => 'nullable|string|max:100',
                'completed' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $task = Task::create([
                'title' => $request->title,
                'note' => $request->note,
                'priority' => $request->priority,
                'category' => $request->category,
                'completed' => $request->completed ?? false
            ]);

            return response()->json($task, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la tarea: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $task = Task::findOrFail($id);
            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Tarea no encontrada: ' . $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|min:3|max:255',
                'note' => 'nullable|string|max:1000',
                'priority' => 'sometimes|in:low,medium,high',
                'category' => 'nullable|string|max:100',
                'completed' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $task->update($request->all());

            return response()->json($task);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la tarea: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy($id)
    {
        try {
            $task = Task::findOrFail($id);
            $task->delete();

            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la tarea: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener todas las categorías
     */
    public function categories()
    {
        try {
            $categories = Task::getCategories();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener categorías: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener estadísticas de tareas
     */
    public function stats()
    {
        try {
            $stats = [
                'total' => Task::count(),
                'completed' => Task::completed()->count(),
                'pending' => Task::pending()->count(),
                'by_priority' => [
                    'high' => Task::priority('high')->count(),
                    'medium' => Task::priority('medium')->count(),
                    'low' => Task::priority('low')->count(),
                ],
                'categories' => Task::getCategories()
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}