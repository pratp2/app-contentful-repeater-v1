const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const jsdocPlugin = require('eslint-plugin-jsdoc');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [

  // Files to ignore (replaces .eslintignore)
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '*.d.ts'],
  },

  // TypeScript files rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jsdoc: jsdocPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Pull in recommended TypeScript rules then override/extend specific rules below
      ...tsPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
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
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
  },
  // Test files: allow `any` for mocks and test helpers (override after recommended rules)
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  }
];