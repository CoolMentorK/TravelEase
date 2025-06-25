import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from 'react-native';
import getEnvVars from '../../config.tsx';

const { API_BASE_URL } = getEnvVars();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      Alert.alert('Welcome', `${data.user.email}`);
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' },
      ]}
    >
      <Text
        style={[
          styles.logo,
          { color: isDarkMode ? '#007AB8' : '#005F8D' },
        ]}
        accessibilityLabel="TravelEase logo"
      >
        TravelEase
      </Text>

      <Text style={[styles.title, { color: isDarkMode ? '#E0E0E0' : '#005F8D' }]}>
        Welcome Back
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#888'}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
            borderColor: isDarkMode ? '#4FB993' : '#DDD',
          },
        ]}
        onChangeText={setEmail}
        accessibilityLabel="Email input"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#888'}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
            borderColor: isDarkMode ? '#4FB993' : '#DDD',
          },
        ]}
        onChangeText={setPassword}
        accessibilityLabel="Password input"
      />

      <TouchableOpacity
        onPress={() => Alert.alert('Forgot Password', 'Feature coming soon!')}
        style={styles.forgotWrapper}
        accessibilityRole="button"
        accessibilityLabel="Forgot Password"
      >
        <Text
          style={[
            styles.forgotText,
            { color: isDarkMode ? '#4FB993' : '#005F8D' },
          ]}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDarkMode ? '#FFAA5A' : '#F2994A' },
        ]}
        onPress={handleLogin}
        accessibilityRole="button"
        accessibilityLabel="Login button"
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={styles.linkWrapper}
        accessibilityRole="button"
        accessibilityLabel="Sign Up link"
      >
        <Text
          style={[
            styles.linkText,
            { color: isDarkMode ? '#4FB993' : '#005F8D' },
          ]}
        >
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, // Adjusted for logo placement
    // Subtle cultural motif: faint shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 100,
    textAlign: 'center',
    // Subtle saffron underline for cultural accent
    textDecorationColor: '#F2C94C',
    textDecorationStyle: 'solid',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop:50,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    // Add subtle cultural accent with Tea Green border in dark mode
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    padding: 8, // Larger tap target
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    // Ensure button stands out with slight elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  linkWrapper: {
    marginTop: 20,
    alignItems: 'center',
    padding: 8, // Larger tap target
  },
  linkText: {
    fontSize: 14,
  },
});