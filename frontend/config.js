import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_BASE_URL: 'http://localhost:5000',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51Hxxxxxxx',
    PAYHERE_MERCHANT_ID: '1212345',
  },
  prod: {
    API_BASE_URL: 'https://api.travelease.com',
    STRIPE_PUBLISHABLE_KEY: 'pk_live_51Hxxxxxxx',
    PAYHERE_MERCHANT_ID: '1212345',
  }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) return ENV.dev;
  else return ENV.prod;
};

export default getEnvVars();