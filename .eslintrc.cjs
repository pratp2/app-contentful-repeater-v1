module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended-typescript',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    // Encourage JSDoc/TSDoc on exported API surfaces
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-returns': 'warn',
    // TypeScript-specific recommendations
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
};