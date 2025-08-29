import React, { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import TaskList from '../../src/components/TaskList';
import AddTaskModal from '../../src/components/AddTaskModal';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import { Task, TaskForm } from '../../src/types/Task';
import { taskAPI } from '../../src/services/api';

// Función helper para manejar errores
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'Error desconocido';
  }
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadTasks = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const fetchedTasks = await taskAPI.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (taskForm: TaskForm) => {
    setIsProcessing(true);
    try {
      const newTask = await taskAPI.createTask(taskForm);
      setTasks([...tasks, newTask]);
    } catch (err) {
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    setIsProcessing(true);
    try {
      await taskAPI.updateTask(id, { completed });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed } : task
        )
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    setIsProcessing(true);
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar la tarea');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading && !refreshing) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        refreshing={refreshing}
        onRefresh={() => loadTasks(true)}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
        onAddPress={() => setModalVisible(true)}
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}