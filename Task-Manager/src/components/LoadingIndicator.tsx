import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Cargando...' 
}) => {
  return (
    <View style={globalStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 10 }}>{message}</Text>
    </View>
  );
};

export default LoadingIndicator;