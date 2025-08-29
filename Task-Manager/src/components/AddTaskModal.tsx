import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { TaskForm } from '../types/Task';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: TaskForm) => Promise<void>;
  existingCategories?: string[];
}

const priorityOptions = [
  { value: 'low' as const, label: 'Baja', color: '#28a745' },
  { value: 'medium' as const, label: 'Media', color: '#ffc107' },
  { value: 'high' as const, label: 'Alta', color: '#dc3545' },
];

// Función separada para estilos condicionales
const priorityButtonSelected = (color: string) => ({
  backgroundColor: color + '20',
  borderColor: color,
});

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
  existingCategories = [],
}) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      // Resetear form cuando se cierra el modal
      setTitle('');
      setNote('');
      setPriority('medium');
      setCategory('');
      setNewCategory('');
      setIsCreatingCategory(false);
      setError('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    // Validación
    if (title.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres');
      return;
    }

    if (isCreatingCategory && newCategory.trim().length === 0) {
      setError('El nombre de la categoría no puede estar vacío');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const finalCategory = isCreatingCategory ? newCategory.trim() : category;
      
      await onSubmit({ 
        title: title.trim(), 
        note: note.trim(),
        priority,
        category: finalCategory || undefined
      });
      
      onClose();
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setNote('');
    setPriority('medium');
    setCategory('');
    setNewCategory('');
    setIsCreatingCategory(false);
    setError('');
    onClose();
  };

  const toggleCategoryCreation = () => {
    setIsCreatingCategory(!isCreatingCategory);
    setNewCategory('');
    setCategory('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.modalContainer}
      >
        <View style={globalStyles.modalContent}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>Nueva Tarea</Text>
            <TouchableOpacity onPress={handleClose} style={globalStyles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <Text style={globalStyles.inputLabel}>Título de la tarea *</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Escribe aquí tu tarea..."
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError('');
              }}
              editable={!isSubmitting}
            />

            <Text style={globalStyles.inputLabel}>Nota (opcional)</Text>
            <TextInput
              style={[globalStyles.input, styles.noteInput]}
              placeholder="Añade una nota o descripción..."
              value={note}
              onChangeText={setNote}
              editable={!isSubmitting}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={globalStyles.inputLabel}>Prioridad</Text>
            <View style={styles.priorityContainer}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityButton,
                    priority === option.value && priorityButtonSelected(option.color)
                  ]}
                  onPress={() => setPriority(option.value)}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === option.value && styles.priorityButtonTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={globalStyles.inputLabel}>Categoría (opcional)</Text>
            
            <TouchableOpacity 
              style={styles.categoryToggle}
              onPress={toggleCategoryCreation}
              disabled={isSubmitting}
            >
              <Text style={styles.categoryToggleText}>
                {isCreatingCategory ? 'Elegir categoría existente' : 'Crear nueva categoría'}
              </Text>
            </TouchableOpacity>

            {isCreatingCategory ? (
              <TextInput
                style={globalStyles.input}
                placeholder="Nombre de la nueva categoría..."
                value={newCategory}
                onChangeText={setNewCategory}
                editable={!isSubmitting}
              />
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                <View style={styles.categoriesContainer}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      !category && styles.categoryButtonSelected
                    ]}
                    onPress={() => setCategory('')}
                  >
                    <Text style={styles.categoryButtonText}>Sin categoría</Text>
                  </TouchableOpacity>
                  
                  {existingCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        category === cat && styles.categoryButtonSelected
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={styles.categoryButtonText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

            <View style={globalStyles.buttonGroup}>
              <TouchableOpacity
                style={[globalStyles.button, globalStyles.cancelButton]}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={globalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  globalStyles.button,
                  globalStyles.submitButton,
                  isSubmitting && globalStyles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={globalStyles.buttonText}>
                  {isSubmitting ? 'Creando...' : 'Crear Tarea'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    maxHeight: '80%',
  },
  noteInput: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F8FAFC',
  },
  priorityButtonText: {
    color: '#718096',
    fontWeight: '600',
  },
  priorityButtonTextSelected: {
    color: '#2D3748',
    fontWeight: 'bold',
  },
  categoryToggle: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryToggleText: {
    color: '#4361EE',
    fontWeight: '600',
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: '#4361EE20',
    borderColor: '#4361EE',
  },
  categoryButtonText: {
    color: '#4A5568',
    fontWeight: '600',
  },
});

export default AddTaskModal;