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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getEnvVars from '../../config.tsx';

const { API_BASE_URL } = getEnvVars();

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      Alert.alert('Account Created', `Welcome ${data.user.name}`);
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Feature coming soon!');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Feature coming soon!');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' }]}>
      <Text
        style={[styles.logo, { color: isDarkMode ? '#007AB8' : '#005F8D' }]}
        accessibilityLabel='TravelEase logo'>
        TravelEase
      </Text>

      <Text style={[styles.title, { color: isDarkMode ? '#E0E0E0' : '#005F8D' }]}>
        Create Account
      </Text>

      <TextInput
        placeholder='Name'
        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#888'}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
            borderColor: isDarkMode ? '#4FB993' : '#DDD',
          },
        ]}
        onChangeText={setName}
        accessibilityLabel='Name input'
      />
      <TextInput
        placeholder='Email'
        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#888'}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
            borderColor: isDarkMode ? '#4FB993' : '#DDD',
          },
        ]}
        onChangeText={setEmail}
        accessibilityLabel='Email input'
      />
      <TextInput
        placeholder='Password'
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
        accessibilityLabel='Password input'
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDarkMode ? '#FFAA5A' : '#F2994A' }]}
        onPress={handleSignup}
        accessibilityRole='button'
        accessibilityLabel='Sign Up button'>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={[styles.orText, { color: isDarkMode ? '#A0A0A0' : '#888' }]}>OR</Text>

      <View style={styles.socialButtonContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
              borderColor: isDarkMode ? '#4FB993' : '#000000',
            },
          ]}
          onPress={handleGoogleLogin}
          accessibilityRole='button'
          accessibilityLabel='Sign up with Google'>
          <Icon name='google' size={24} color={isDarkMode ? '#E0E0E0' : '#000000'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: '#000000',
              borderColor: isDarkMode ? '#4FB993' : '#000000',
            },
          ]}
          onPress={handleAppleLogin}
          accessibilityRole='button'
          accessibilityLabel='Sign up with Apple'>
          <Icon name='apple' size={24} color='#FFFFFF' />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkWrapper}
        accessibilityRole='button'
        accessibilityLabel='Log In link'>
        <Text style={[styles.linkText, { color: isDarkMode ? '#4FB993' : '#005F8D' }]}>
          Already have an account? Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30, // Adjusted for logo placement
    // Subtle cultural motif: faint shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
  linkText: {
    fontSize: 14,
  },
  linkWrapper: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8, // Larger tap target
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 100,
    textAlign: 'center',
    // Subtle saffron underline for cultural accent
    textDecorationLine: 'underline',
    textDecorationColor: '#F2C94C',
    textDecorationStyle: 'solid',
  },
  orText: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 20,
    textAlign: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle cultural accent with Tea Green border in dark mode
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    width: '60%',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
});
