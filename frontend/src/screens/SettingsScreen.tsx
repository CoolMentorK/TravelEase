import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from "react-native";
import TranslationToggle from "../components/TranslationToggle";

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    // Optional: Save to AsyncStorage or Context
  };

  const handleLogout = () => {
    Alert.alert("Logged out", "You have been logged out.");
    // Add real logout logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>App Language</Text>
        <TranslationToggle onChange={(lang) => console.log("Language set:", lang)} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: { marginBottom: 30 },
  label: { fontSize: 16, marginBottom: 10 },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});

export default SettingsScreen;