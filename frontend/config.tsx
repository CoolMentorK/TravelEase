interface EnvConfig {
  API_BASE_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  PAYHERE_MERCHANT_ID: string;
}

const ENV: { dev: EnvConfig; prod: EnvConfig } = {
  dev: {
    API_BASE_URL: 'http://localhost:5000',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_51Hxxxxxxx',
    PAYHERE_MERCHANT_ID: '1212345',
  },
  prod: {
    API_BASE_URL: 'https://api.travelease.com',
    STRIPE_PUBLISHABLE_KEY: 'pk_live_51Hxxxxxxx',
    PAYHERE_MERCHANT_ID: '1212345',
  },
};

const getEnvVars = (): EnvConfig => {
  return __DEV__ ? ENV.dev : ENV.prod;
};

export default getEnvVars();
