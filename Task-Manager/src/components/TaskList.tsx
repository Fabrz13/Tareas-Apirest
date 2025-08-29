import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
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
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={{ color: '#007AFF' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.header, { marginTop: 40 }]}>Mis Tareas</Text>

      <TouchableOpacity style={globalStyles.addButton} onPress={onAddPress}>
        <Text style={globalStyles.addButtonText}>Agregar Tarea</Text>
      </TouchableOpacity>

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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={globalStyles.emptyState}>
            No hay tareas. ¡Agrega una nueva!
          </Text>
        }
      />
    </View>
  );
};

export default TaskList;