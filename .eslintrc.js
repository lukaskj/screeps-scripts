module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "eslint:recommended"],

  root: true,
  env: {
    node: true,
    jest: true,
  },
  globals: {
    BufferEncoding: "readonly",
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", {vars: "all", argsIgnorePattern: "^_"}],
    "no-unused-vars": ["error", {vars: "all", argsIgnorePattern: "^_"}],
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.ts", "**/*.fixture.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
