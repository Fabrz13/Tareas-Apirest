import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface FilterButtonsProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <View style={globalStyles.filterContainer}>
      <TouchableOpacity
        style={[
          globalStyles.filterButton,
          currentFilter === 'all' && globalStyles.filterButtonActive
        ]}
        onPress={() => onFilterChange('all')}
      >
        <Text
          style={[
            globalStyles.filterButtonText,
            currentFilter === 'all' && globalStyles.filterButtonTextActive
          ]}
        >
          Todas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.filterButton,
          currentFilter === 'active' && globalStyles.filterButtonActive
        ]}
        onPress={() => onFilterChange('active')}
      >
        <Text
          style={[
            globalStyles.filterButtonText,
            currentFilter === 'active' && globalStyles.filterButtonTextActive
          ]}
        >
          Activas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          globalStyles.filterButton,
          currentFilter === 'completed' && globalStyles.filterButtonActive
        ]}
        onPress={() => onFilterChange('completed')}
      >
        <Text
          style={[
            globalStyles.filterButtonText,
            currentFilter === 'completed' && globalStyles.filterButtonTextActive
          ]}
        >
          Completadas
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterButtons;