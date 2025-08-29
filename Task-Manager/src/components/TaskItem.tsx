import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/Task';
import { Swipeable } from 'react-native-gesture-handler';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => onDelete(task.id), style: 'destructive' },
      ]
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={handleDelete} style={styles.deleteContainer}>
        <Animated.View style={[styles.deleteButton, { transform: [{ scale }] }]}>
          <Ionicons name="trash" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[styles.container, task.completed && styles.completedContainer]}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => onToggleComplete(task.id, !task.completed)}
        >
          <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
            {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>
          {task.createdAt && (
            <Text style={styles.dateText}>
              {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: '#f8f9fa',
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
  },
  deleteContainer: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  deleteButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskItem;