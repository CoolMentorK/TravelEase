module.exports = {
  env: {
    'react-native/react-native': true,
    node: true,
    es2021: true,
    jest: true, // Moved here to cover all test files
  },
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-native',
    'security',
    'no-secrets',
    'prettier', // Added Prettier plugin
  ],
  rules: {
    // React Native specific
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',

    // Security rules
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-fs-filename': 'off',
    'no-secrets/no-secrets': ['error', { tolerance: 4.2 }],
    'no-process-env': 'error',

    // Database/MongoDB specific
    'security/detect-non-literal-require': 'off',
    'security/detect-non-literal-regexp': 'off',

    // React specific
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',

    // Prettier integration
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSameLine: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 100,
        tabWidth: 2,
        semi: false,
        jsxSingleQuote: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      files: ['**/__tests__/**', '**/*.test.js'],
      rules: {
        'no-secrets/no-secrets': 'off', // Disable secret detection in tests
      },
    },
  ],
};