import playwright from "eslint-plugin-playwright";

const playwrightRules = [
  {
    files: ["**/*.spec.ts", "tests/**/*.ts"],

    plugins: {
      playwright,
    },

    /**
     * Prevent inline eslint-disable comments from suppressing the
     * no-focused-test rule. A developer cannot write
     * `// eslint-disable-next-line playwright/no-focused-test` and have
     * it take effect — ESLint will error on the disable directive itself.
     *
     * NOTE: The raw-grep check in the pre-push hook is the final safety net
     * and also cannot be bypassed by any ESLint directive.
     */
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },

    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/expect-expect": "off",
      "no-console": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",

      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default playwrightRules;