module.exports = {
  overrides: [
    // src app files
    {
      files: ['src/**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
        'plugin:react/recommended',
      ],
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        // any custom rules we want
      },
    },
    // nodejs config files
    {
      files: '**/*.js',
      parser: '@typescript-eslint/parser',
      env: {
        node: true,
        es6: true,
      },
      extends: ['eslint:recommended', 'prettier'],
    },
  ],
}
