import axios from 'axios';
import { Task, TaskForm } from '../types/Task';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

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
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/todos?_limit=10');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  createTask: async (task: TaskForm): Promise<Task> => {
    try {
      const response = await api.post('/todos', {
        title: task.title,
        completed: false,
        userId: 1,
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
};