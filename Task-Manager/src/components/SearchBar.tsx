import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    setQuery(text);
    onSearch(text); // Búsqueda en tiempo real
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={globalStyles.searchContainer}>
      <View style={[
        globalStyles.searchInputContainer,
        isFocused && globalStyles.searchInputContainerFocused
      ]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? '#007AFF' : '#999'} 
          style={globalStyles.searchIcon} 
        />
        
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Buscar tareas..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
        />
        
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={globalStyles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;