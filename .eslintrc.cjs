/* eslint-env node */
module.exports = {
  root: true,
  plugins: [
    "@typescript-eslint",
    "write-good-comments",
    "perfectionist",
    "security",
    "sonarjs",
    "promise",
    "jsdoc",
    "jest",
  ],
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:jsdoc/recommended-typescript",
    "plugin:sonarjs/recommended",
    "plugin:promise/recommended",
    "plugin:security/recommended-legacy",
    "plugin:jest/recommended",
    "plugin:jest/style",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["workflow/**/*.js", "coverage", "*.js", "tsconfig.json"],
  rules: {
    "write-good-comments/write-good-comments": [
      "warn",
      {
        passive: false,
        whitelist: ["read-only"],
      },
    ],
    "perfectionist/sort-objects": [
      "warn",
      {
        type: "natural",
        order: "asc",
      },
    ],
    "@typescript-eslint/no-inferrable-types": 0,
    /**
     * Why ignore this security rule:
     * {@link isValidPathSchema} mitigates the risk.
     */
    "security/detect-non-literal-fs-filename": 0,
    /**
     * Why ignore this security rule:
     * https://github.com/eslint-community/eslint-plugin-security/issues/21#issuecomment-1157887653
     */
    "security/detect-object-injection": 0,
    /**
     * Prefer namespaces over modules
     */
    "@typescript-eslint/no-namespace": 0,
    /**
     * TODO:  Remove this ignore after fixing top level tsconfig issue
     */
    "@typescript-eslint/no-unsafe-call": 0,
    /**
     * TODO:  Remove this ignore after fixing top level tsconfig issue
     */
    "@typescript-eslint/no-unsafe-member-access": 0,
    /**
     * jsdoc rule adds
     */
    "jsdoc/require-description": 1,
    "jsdoc/require-description-complete-sentence": 1,
    "jsdoc/require-hyphen-before-param-description": 1,
    "jsdoc/informative-docs": 1,
    "jsdoc/sort-tags": 1,
    "jsdoc/require-throws": 1,
  },
};
