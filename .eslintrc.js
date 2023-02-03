module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'packages/*/tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  root: true,
  env: {
    node: true,
    commonjs: true,
  },
  ignorePatterns: ['**/*.js', 'dist', '**/*.d.ts'],
};
