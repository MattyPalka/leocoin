module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    node: true
  },
  plugins: ['@typescript-eslint', 'import-quotes'],
  extends: [
    'standard',
    'plugin:node/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] }
    ],
    'node/no-missing-import': 'warn',
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'import-quotes/import-quotes': [1, 'single'],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'jsx-quotes': [
      'error',
      'prefer-single',
    ],
    'no-mixed-spaces-and-tabs': [
      'error',
    ],
    'no-multiple-empty-lines': [
      'error',
      { max: 1 },
    ],
    'space-in-parens': [
      'error',
    ],
    'arrow-spacing': [
      'error',
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'space-before-blocks': [
      'error',
      'always',
    ],
  }
};
