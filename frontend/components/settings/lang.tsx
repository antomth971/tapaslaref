import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLanguage } from '@/hooks/providers/LangageProvider'; 
import Dropdown from '../dropdown';
export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Dropdown
        options={[
          { label: 'English', value: 'en' },
          { label: 'Français', value: 'fr' },
        ]}
        selectedValue={locale}
        onSelect={(value) => changeLanguage(value)}
        placeholder="Select Language"
        style={styles.picker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  picker: {
    width: 160,
    height: 40,
    color: '#333',
  },
});
