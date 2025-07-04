import { DEV_API_IP, STRIPE_PUBLISHABLE_KEY, PAYHERE_MERCHANT_ID } from '@env';
import { Platform } from 'react-native';

// Utility for resolving local IP fallback
const getLocalHost = () => DEV_API_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

// REST API for backend server
const getLocalApiUrl = () => `http://${getLocalHost()}:5000`;

// AI model server (separate port)
const getLocalAiUrl = () => `http://${getLocalHost()}:5001`;

export interface EnvConfig {
  API_BASE_URL: string;
  AI_API_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  PAYHERE_MERCHANT_ID: string;
}

// Define development and production configurations
const ENV: { dev: EnvConfig; prod: EnvConfig } = {
  dev: {
    API_BASE_URL: getLocalApiUrl(),
    AI_API_URL: getLocalAiUrl(),
    STRIPE_PUBLISHABLE_KEY,
    PAYHERE_MERCHANT_ID,
  },
  prod: {
    API_BASE_URL: 'https://api.travelease.com',
    AI_API_URL: 'https://ai.travelease.com', // ✅ Replace with real endpoint if needed
    STRIPE_PUBLISHABLE_KEY,
    PAYHERE_MERCHANT_ID,
  },
};

// Select based on React Native __DEV__ flag
const getEnvVars = (): EnvConfig => (__DEV__ ? ENV.dev : ENV.prod);

export default getEnvVars;
