import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { TaskForm } from '../types/Task';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: TaskForm) => Promise<void>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validación
    if (title.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({ title: title.trim() });
      setTitle('');
      onClose();
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setError('');
    onClose();
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

          <ScrollView>
            <Text style={globalStyles.inputLabel}>Título de la tarea</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Escribe aquí tu tarea..."
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError('');
              }}
              editable={!isSubmitting}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

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
                {isSubmitting ? (
                  <Text style={globalStyles.buttonText}>Creando...</Text>
                ) : (
                  <Text style={globalStyles.buttonText}>
                    <Ionicons name="add" size={16} color="white" /> Crear
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddTaskModal;