import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import getEnvVars from '../../config.tsx';
import { saveAccessToken } from '../utils/auth.ts';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/MainStack.tsx';
import { COLORS } from '../constants/colors.ts';

const { API_BASE_URL } = getEnvVars();

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  containerDark: {
    backgroundColor: COLORS.darkBackground, // #121212
  },
  containerLight: {
    backgroundColor: COLORS.lightBackground, // #F5F5F5
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotTextDark: {
    color: COLORS.greenAccent, // #4FB993
  },
  forgotTextLight: {
    color: COLORS.primary, // #005F8D
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    padding: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 16,
    padding: 14,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  inputDark: {
    backgroundColor: COLORS.darkSurface, // #2A2A2A
    borderColor: COLORS.greenAccent, // #4FB993
  },
  inputLight: {
    backgroundColor: COLORS.white, // #FFFFFF
    borderColor: COLORS.borderLight, // #DDD
  },
  linkText: {
    fontSize: 14,
  },
  linkTextSignupDark: {
    color: COLORS.greenAccent, // #4FB993
  },
  linkTextSignupLight: {
    color: COLORS.primary, // #005F8D
  },
  linkTextVendorDark: {
    color: COLORS.accent, // #F2C94C
  },
  linkTextVendorLight: {
    color: COLORS.orangeAccent, // #F2994A
  },
  linkWrapper: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  loginButtonDark: {
    backgroundColor: COLORS.orangeDark, // #FFAA5A
  },
  loginButtonLight: {
    backgroundColor: COLORS.orangeAccent, // #F2994A
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 100,
    textAlign: 'center',
    textDecorationColor: COLORS.accent, // #F2C94C
    textDecorationStyle: 'solid',
  },
  logoDark: {
    color: COLORS.blueDark, // #007AB8
  },
  logoLight: {
    color: COLORS.primary, // #005F8D
  },
  orText: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 20,
    textAlign: 'center',
  },
  orTextDark: {
    color: COLORS.grayLight, // #A0A0A0
  },
  orTextLight: {
    color: COLORS.textSecondary, // #888
  },
  socialButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 48,
  },
  socialButtonApple: {
    backgroundColor: COLORS.black, // #000000
    borderColor: COLORS.black, // #000000
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    width: '60%',
  },
  socialButtonGoogleDark: {
    backgroundColor: COLORS.darkSurface, // #2A2A2A
    borderColor: COLORS.greenAccent, // #4FB993
  },
  socialButtonGoogleLight: {
    backgroundColor: COLORS.white, // #FFFFFF
    borderColor: COLORS.black, // #000000
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  titleDark: {
    color: COLORS.grayLight, // #E0E0E0
  },
  titleLight: {
    color: COLORS.primary, // #005F8D
  },
  logoImage: {
    marginTop:-30,
    width: 300,     // adjust width to your liking
    height: 200,     // adjust height to your liking
    alignSelf: 'center',
  },

});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Login Failed', data.message || 'Login failed');
        return;
      }

      await saveAccessToken(data.token);
      Alert.alert('Welcome', `${data.user.email}`);
      navigation.navigate('Home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      Alert.alert('Login Failed', message);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Feature coming soon!');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Feature coming soon!');
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <Image
          source={require('../../assests/logo2.png')} // adjust the path as per your project structure
          style={styles.logoImage}
          accessibilityLabel='TravelEase logo'
          resizeMode="contain"
      />


      <Text style={[styles.title, isDarkMode ? styles.titleDark : styles.titleLight]}>
        Welcome Back
      </Text>

      <TextInput
        placeholder='Email'
        placeholderTextColor={isDarkMode ? COLORS.grayLight : COLORS.textSecondary}
        style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
        onChangeText={setEmail}
        accessibilityLabel='Email input'
      />
      <TextInput
        placeholder='Password'
        secureTextEntry
        placeholderTextColor={isDarkMode ? COLORS.grayLight : COLORS.textSecondary}
        style={[styles.input, isDarkMode ? styles.inputDark : styles.inputLight]}
        onChangeText={setPassword}
        accessibilityLabel='Password input'
      />

      <TouchableOpacity
        onPress={() => Alert.alert('Forgot Password', 'Feature coming soon!')}
        style={styles.forgotWrapper}
        accessibilityRole='button'
        accessibilityLabel='Forgot Password'>
        <Text
          style={[styles.forgotText, isDarkMode ? styles.forgotTextDark : styles.forgotTextLight]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isDarkMode ? styles.loginButtonDark : styles.loginButtonLight]}
        onPress={handleLogin}
        accessibilityRole='button'
        accessibilityLabel='Login button'>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={[styles.orText, isDarkMode ? styles.orTextDark : styles.orTextLight]}>OR</Text>

      <View style={styles.socialButtonContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            isDarkMode ? styles.socialButtonGoogleDark : styles.socialButtonGoogleLight,
          ]}
          onPress={handleGoogleLogin}
          accessibilityRole='button'
          accessibilityLabel='Login with Google'>
          <Icon name='google' size={24} color={isDarkMode ? COLORS.grayLight : COLORS.black} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.socialButtonApple]}
          onPress={handleAppleLogin}
          accessibilityRole='button'
          accessibilityLabel='Login with Apple'>
          <Icon name='apple' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Signup')}
        style={styles.linkWrapper}
        accessibilityRole='button'
        accessibilityLabel='Sign Up link'>
        <Text
          style={[
            styles.linkText,
            isDarkMode ? styles.linkTextSignupDark : styles.linkTextSignupLight,
          ]}>
          Don&apos;t have an account? Sign Up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('VendorLogin')}
        style={styles.linkWrapper}
        accessibilityRole='button'
        accessibilityLabel='Vendor Login link'>
        <Text
          style={[
            styles.linkText,
            isDarkMode ? styles.linkTextVendorDark : styles.linkTextVendorLight,
          ]}>
          Are you a vendor? Login here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
