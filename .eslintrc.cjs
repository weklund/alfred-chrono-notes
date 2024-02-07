/* eslint-env node */
module.exports = {
    root: true,
    plugins: [
        '@typescript-eslint',
        'write-good-comments',
        'perfectionist',
        'security',
        'sonarjs',
        'promise',
        'jest'
    ],
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:sonarjs/recommended',
        'plugin:promise/recommended',
        'plugin:security/recommended-legacy',
        'plugin:jest/recommended',
        'plugin:jest/style'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: [
        'workflow/**/*.js',
        'coverage',
        '*.js',
    ],
    rules: {
        'write-good-comments/write-good-comments': [
            'warn',
            {
                'passive': false,
                'whitelist': ['read-only']
            }
        ],
        'perfectionist/sort-objects': [
            'error',
            {
                type: 'natural',
                order: 'asc',
            },
        ],
        '@typescript-eslint/no-inferrable-types': 0,
        'security/detect-non-literal-fs-filename': 0
    }
};