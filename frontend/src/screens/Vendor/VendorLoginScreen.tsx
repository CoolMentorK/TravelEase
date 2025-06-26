import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import getEnvVars from '../../../config.tsx';

const { API_BASE_URL } = getEnvVars();

const VendorLoginScreen = () => {
  const navigation = useNavigation();
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

      // ✅ Optional: Store token in async storage or context for reuse
      // await AsyncStorage.setItem('vendorToken', data.token)

      Alert.alert('Welcome', `Logged in as ${data.vendor.name}`);
      navigation.navigate('VendorDashboard'); // 👈 redirect to dashboard
    } catch (err) {
      Alert.alert('Error', 'Network request failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Login</Text>

      <View style={styles.inputContainer}>
        <Icon name='mail' size={20} color='#005F8D' style={styles.icon} />
        <TextInput
          placeholder='Email'
          style={styles.input}
          autoCapitalize='none'
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name='lock' size={20} color='#005F8D' style={styles.icon} />
        <TextInput
          placeholder='Password'
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
        <LinearGradient
          colors={['#F2994A', '#F2C94C']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('VendorRegister')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VendorLoginScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginBottom: 20,
    marginTop: 12,
  },
  container: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F9F9F9',
    borderColor: '#D1D1D1',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  linkText: {
    color: '#4FB993',
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    color: '#005F8D',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
});
