import { DEV_API_IP, STRIPE_PUBLISHABLE_KEY, PAYHERE_MERCHANT_ID } from '@env';
import { Platform } from 'react-native';

const getLocalApiUrl = () =>
  __DEV__
    ? `http://${DEV_API_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost')}:5000`
    : 'https://api.travelease.com';

export interface EnvConfig {
  API_BASE_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  PAYHERE_MERCHANT_ID: string;
}

const ENV: { dev: EnvConfig; prod: EnvConfig } = {
  dev: {
    API_BASE_URL: getLocalApiUrl(),
    STRIPE_PUBLISHABLE_KEY,
    PAYHERE_MERCHANT_ID,
  },
  prod: {
    API_BASE_URL: 'https://api.travelease.com',
    STRIPE_PUBLISHABLE_KEY,
    PAYHERE_MERCHANT_ID,
  },
};

const getEnvVars = (): EnvConfig => (__DEV__ ? ENV.dev : ENV.prod);
export default getEnvVars;
