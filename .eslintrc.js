module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb/hooks',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'import', 'jsx-a11y', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': 'off', // No more warnings for missing package.json references
    'react/prop-types': 'off', // No need to define prop types
    'camelcase': 'off', // Allows non-camelCase names
    'react/jsx-props-no-spreading': 'off', // Allows prop spreading
    'react/function-component-definition': 'off', // Allows arrow functions or function declarations
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
