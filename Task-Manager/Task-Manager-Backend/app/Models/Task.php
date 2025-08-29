<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'note',
        'priority',
        'category',
        'completed'
    ];

    protected $casts = [
        'completed' => 'boolean'
    ];

    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopePending($query)
    {
        return $query->where('completed', false);
    }

    public static function getCategories()
    {
        return self::whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->toArray();
    }
}