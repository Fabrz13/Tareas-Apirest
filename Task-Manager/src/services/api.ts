import axios from 'axios';
import { Task, TaskForm } from '../types/Task';

const API_BASE_URL = 'http://192.168.68.52:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Función helper para errores
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Error de conexión';
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'Error desconocido';
  }
};

export const taskAPI = {
  getTasks: async (params?: {
    status?: 'active' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    search?: string;
  }): Promise<Task[]> => {
    try {
      const response = await api.get('/todos', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  createTask: async (task: TaskForm): Promise<Task> => {
    try {
      const response = await api.post('/todos', {
        title: task.title,
        note: task.note,
        priority: task.priority,
        category: task.category,
        completed: false,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  updateTask: async (id: number, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.patch(`/todos/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    try {
      await api.delete(`/todos/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Nuevos métodos
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  getStats: async (): Promise<any> => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};