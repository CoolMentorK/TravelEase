import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather.js';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/MainStack.tsx';
import getEnvVars from '../../../config.tsx';
import { COLORS } from '../../constants/colors.ts';

const { API_BASE_URL } = getEnvVars();

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 14,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginBottom: 20,
    marginTop: 12,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.inputBorderLight,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  linkText: {
    color: COLORS.greenAccent,
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
});

const VendorLoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Login Failed', data.message || 'Check credentials');
        return;
      }

      Alert.alert('Welcome', `Logged in as ${data.vendor.name}`);
      navigation.navigate('VendorDashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network request failed';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Login</Text>

      <View style={styles.inputContainer}>
        <Icon name='mail' size={20} color={COLORS.primary} style={styles.icon} />
        <TextInput
          placeholder='Email'
          style={styles.input}
          autoCapitalize='none'
          onChangeText={setEmail}
          value={email}
          accessibilityLabel='Email input'
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name='lock' size={20} color={COLORS.primary} style={styles.icon} />
        <TextInput
          placeholder='Password'
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          accessibilityLabel='Password input'
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
        <LinearGradient
          colors={COLORS.accentGradient}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('VendorRegister')}>
        <Text style={styles.linkText}>Don&apos;t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VendorLoginScreen;
