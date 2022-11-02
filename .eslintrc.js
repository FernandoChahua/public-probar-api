module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '*.json','*.hbs'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'linebreak-style' : ['error', 'unix'],
    'no-param-reassign': 0,
    'max-len': ['error', { 'code': 200 }],
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-useless-constructor': 0,
    'no-unused-vars': 0,
    'no-empty-function': 0,
    'class-methods-use-this': 0,
    'import/extensions': 0
  },
};
