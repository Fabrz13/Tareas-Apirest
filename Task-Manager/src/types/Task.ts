export interface Task {
  id: number;
  title: string;
  note?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskForm {
  title: string;
  note?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}