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
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/todos'); // Cambiado a /todos
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  createTask: async (task: TaskForm): Promise<Task> => {
    try {
      const response = await api.post('/todos', { // Cambiado a /todos
        title: task.title,
        completed: false,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  updateTask: async (id: number, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.patch(`/todos/${id}`, updates); // Cambiado a /todos
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  deleteTask: async (id: number): Promise<void> => {
    try {
      await api.delete(`/todos/${id}`); // Cambiado a /todos
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};