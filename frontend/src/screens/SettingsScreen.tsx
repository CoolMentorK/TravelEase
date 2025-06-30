import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import TranslationToggle from '../components/TranslationToggle.tsx';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors.ts';

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { marginBottom: 30 },
  label: { fontSize: 16, marginBottom: 10 },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    marginTop: 40,
    padding: 12,
  },
  logoutText: { color: COLORS.white, fontWeight: 'bold' },
});

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    // Optional: Save to AsyncStorage or Context
  };

  const handleLogout = () => {
    Alert.alert(t('settings.loggedOutTitle'), t('settings.loggedOutMessage'));
    // Add real logout logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('settings.title')}</Text>

      <View style={styles.item}>
        <Text style={styles.label}>{t('settings.language')}</Text>
        <TranslationToggle onChange={lang => i18n.changeLanguage(lang)} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>{t('settings.darkMode')}</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t('settings.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
