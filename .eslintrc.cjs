module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {},
  ignorePatterns: ['**/lib/**/*.js']
}
