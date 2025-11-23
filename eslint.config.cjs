const ts = require('typescript-eslint');
const globals = require('globals');
const react = require('eslint-plugin-react');
const jest = require('eslint-plugin-jest');
const testingLibrary = require('eslint-plugin-testing-library');
const prettier = require('eslint-plugin-prettier');

module.exports = [
    {
        ignores: ['node_modules', 'dist', '.parcel-cache', 'coverage'],
    },

    ...ts.configs.recommended,

    {
        plugins: {
            react,
            prettier,
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            'prettier/prettier': 'warn',
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    jest.configs['flat/recommended'],

    {
        plugins: {
            'testing-library': testingLibrary,
        },
        rules: {
            ...testingLibrary.configs.react.rules,
        },
    },

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },
];
