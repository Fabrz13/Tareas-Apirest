import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
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
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={globalStyles.modalContainer}>
        <View style={globalStyles.modalContent}>
          <Text style={{ fontSize: 18, marginBottom: 16, fontWeight: 'bold' }}>
            Nueva Tarea
          </Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Título de la tarea"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) setError('');
            }}
            editable={!isSubmitting}
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
              style={[globalStyles.button, globalStyles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={globalStyles.buttonText}>
                {isSubmitting ? 'Creando...' : 'Crear'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTaskModal;