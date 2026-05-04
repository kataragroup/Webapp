module.exports = {
  ignores: ['dist/**/*'],
  plugins: {
    '@firebase/security-rules': require('@firebase/eslint-plugin-security-rules'),
  },
  rules: {
    ...require('@firebase/eslint-plugin-security-rules').configs['flat/recommended'].rules,
  },
};
