import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import getEnvVars from '../../../config.tsx';

const { API_BASE_URL } = getEnvVars();

const VendorRegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendor/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, businessType, location }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Registration Failed', data.message || 'Check your input');
        return;
      }

      Alert.alert('Success', 'Vendor registered successfully');
      navigation.navigate('VendorLogin');
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Vendor Registration</Text>

        <View style={styles.inputContainer}>
          <Icon name='user' size={20} color='#005F8D' style={styles.icon} />
          <TextInput
            placeholder='Business Name'
            style={styles.input}
            onChangeText={setName}
            value={name}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name='mail' size={20} color='#005F8D' style={styles.icon} />
          <TextInput
            placeholder='Email'
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            autoCapitalize='none'
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

        <View style={styles.inputContainer}>
          <Icon name='briefcase' size={20} color='#005F8D' style={styles.icon} />
          <TextInput
            placeholder='Business Type (e.g. Hotel, Shop)'
            style={styles.input}
            onChangeText={setBusinessType}
            value={businessType}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name='map-pin' size={20} color='#005F8D' style={styles.icon} />
          <TextInput
            placeholder='Location (e.g. Galle)'
            style={styles.input}
            onChangeText={setLocation}
            value={location}
          />
        </View>

        <TouchableOpacity onPress={handleRegister} style={styles.buttonWrapper}>
          <LinearGradient
            colors={['#F2994A', '#F2C94C']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('VendorLogin')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VendorRegisterScreen;

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
    padding: 24,
    paddingBottom: 60,
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
    marginBottom: 70,
    marginTop: 60,
    textAlign: 'center',
  },
});
