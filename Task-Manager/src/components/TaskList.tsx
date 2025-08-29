import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/Task';
import TaskItem from './TaskItem';
import LoadingIndicator from './LoadingIndicator';
import { globalStyles } from '../styles/globalStyles';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onAddPress: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  refreshing,
  onRefresh,
  onToggleComplete,
  onDelete,
  onAddPress,
}) => {
  if (loading && !refreshing) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={globalStyles.loadingContainer}>
        <Ionicons name="alert-circle" size={48} color="#dc3545" />
        <Text style={globalStyles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={globalStyles.retryButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={16} color="#007AFF" />
          <Text style={globalStyles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerContainer}>
        <Text style={globalStyles.header}>Mis Tareas</Text>
        {totalCount > 0 && (
          <Text style={globalStyles.taskCount}>
            {completedCount} de {totalCount} completadas
          </Text>
        )}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={'#007AFF'}
          />
        }
        ListEmptyComponent={
          <View style={globalStyles.emptyStateContainer}>
            <Ionicons name="checkmark-done-circle" size={64} color="#e9ecef" />
            <Text style={globalStyles.emptyStateTitle}>No hay tareas</Text>
            <Text style={globalStyles.emptyStateText}>
              ¡Agrega una nueva tarea para comenzar!
            </Text>
          </View>
        }
        contentContainerStyle={tasks.length === 0 && globalStyles.emptyListContainer}
      />

      <TouchableOpacity 
        style={globalStyles.floatingAddButton}
        onPress={onAddPress}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TaskList;