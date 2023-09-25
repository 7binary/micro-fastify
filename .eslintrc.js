module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './apps/*/tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['PropertyDefinition'] }],
    'max-len': [
      'error', {
        'code': 100,
        'tabWidth': 2,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreComments': true,
      },
    ],
    'no-unused-vars': 'off',
    'no-multi-spaces': 'error',
    'padding-line-between-statements': [
      'error', {
        'blankLine': 'always',
        'prev': '*',
        'next': 'return',
      },
    ],
    'prefer-template': 'error',
    'quotes': ['error', 'single'],
    'import/newline-after-import': ['error', { 'count': 1 }],
    'key-spacing': ['error', { 'mode': 'strict' }],
    'eol-last': ['error', 'always'],
    'semi': ['error', 'always'],
    'keyword-spacing': ['error', { 'before': true }],
    'space-infix-ops': ['error', { 'int32Hint': false }],
    'object-curly-spacing': [2, 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
