module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended', //  the recommended eslint rules
    'standard',
    'plugin:@typescript-eslint/recommended' //  typescript recommended eslint rules
  ],
  ignorePatterns: ['build'], //  ignore the /build directory that has the JS output
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
  }
}
