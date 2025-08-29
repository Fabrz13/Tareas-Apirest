import React, { useState, useEffect, useCallback } from 'react';
import { Alert, View } from 'react-native';
import TaskList from '../../src/components/TaskList';
import AddTaskModal from '../../src/components/AddTaskModal';
import LoadingIndicator from '../../src/components/LoadingIndicator';
import { Task, TaskForm } from '../../src/types/Task';
import { taskAPI } from '../../src/services/api';
import { globalStyles } from '../../src/styles/globalStyles';
import SearchBar from '../../src/components/SearchBar';
import FilterButtons from '../../src/components/FilterButtons';
import { Stack } from "expo-router";

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Cargar tareas solo una vez al inicio
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

  // Cargar tareas solo al montar el componente
  useEffect(() => {
    loadTasks();
  }, []); // <-- Eliminamos las dependencias que causaban el refresco

  // Filtrar tareas localmente sin recargar de la API
  const filterTasks = useCallback((tasksList: Task[], query: string, filterType: string) => {
    let filtered = [...tasksList]; // Copia de las tareas
    
    // Aplicar filtro de búsqueda
    if (query) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Aplicar filtro de estado
    if (filterType === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filterType === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    setFilteredTasks(filtered);
  }, []);

  // Filtrar cuando cambian los filtros o la búsqueda
  useEffect(() => {
    filterTasks(tasks, searchQuery, filter);
  }, [tasks, searchQuery, filter]); // <-- Solo se ejecuta cuando estas variables cambian

  const handleCreateTask = async (taskForm: TaskForm) => {
    setIsProcessing(true);
    try {
      const newTask = await taskAPI.createTask(taskForm);
      setTasks(prevTasks => [...prevTasks, newTask]); // Actualizar estado local
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
      setTasks(prevTasks => 
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed } : task
        )
      ); // Actualizar estado local
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
      setTasks(prevTasks => prevTasks.filter((task) => task.id !== id)); // Actualizar estado local
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar la tarea');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Solo actualiza el estado de búsqueda
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => {
    setFilter(newFilter); // Solo actualiza el estado del filtro
  };

  const handleRefresh = () => {
    loadTasks(true); // Solo recarga las tareas cuando se hace pull-to-refresh
  };

  if (loading && !refreshing) {
    return <LoadingIndicator />;
  }

  return (
  <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={[globalStyles.container, { marginTop: 40 }]}>
      <SearchBar onSearch={handleSearch} />
      
      <FilterButtons 
        currentFilter={filter} 
        onFilterChange={handleFilterChange} 
      />
      
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
        onAddPress={() => setModalVisible(true)}
      />

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateTask}
      />
    </View>
  </>
  );
}