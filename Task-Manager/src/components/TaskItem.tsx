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
const getPriorityColor = () => {
  switch (task.priority) {
    case 'high': return '#FFF5F5'; // Fondo rojo muy claro
    case 'medium': return '#FFFBEB'; // Fondo amarillo muy claro
    case 'low': return '#F0FFF4'; // Fondo verde muy claro
    default: return '#FFFFFF';
  }
};

// Actualizar la función getPriorityBorderColor
const getPriorityBorderColor = () => {
  switch (task.priority) {
    case 'high': return '#FC8181'; // Rojo
    case 'medium': return '#F6AD55'; // Amarillo anaranjado
    case 'low': return '#68D391'; // Verde
    default: return '#E2E8F0';
  }
};

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
      <View style={[
        styles.container,
        { 
          backgroundColor: getPriorityColor(),
          borderLeftWidth: 4,
          borderLeftColor: getPriorityBorderColor()
        }
      ]}>
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
          
          {task.note && (
            <Text style={styles.noteText} numberOfLines={2}>
              {task.note}
            </Text>
          )}
          
          <View style={styles.metaContainer}>
            {task.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{task.category}</Text>
              </View>
            )}
            
            {task.createdAt && (
              <Text style={styles.dateText}>
                {new Date(task.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.priorityIndicator}>
          <Ionicons 
            name="flag" 
            size={16} 
            color={getPriorityBorderColor()} 
          />
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#06D6A0',
    borderColor: '#06D6A0',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2D3748',
  },
  noteText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  priorityIndicator: {
    marginLeft: 8,
  },
  deleteContainer: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: 12,
  },
  deleteButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskItem;