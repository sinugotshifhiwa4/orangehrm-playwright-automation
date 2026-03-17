import * as tseslint from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import * as playwright from "eslint-plugin-playwright";
import * as importPlugin from "eslint-plugin-import";
import * as unusedImports from "eslint-plugin-unused-imports";

// Import modular ESLint configurations
import { baseAndTypeCheckingConfigs } from "./src/configuration/eslint/baseAndTypeChecking.config.ts";
import { importsConfig } from "./src/configuration/eslint/imports.config.ts";
import { unusedImportsConfig } from "./src/configuration/eslint/unusedImports.config.ts";
import { typeScriptCoreConfig } from "./src/configuration/eslint/typeScriptCore.config.ts";
import { playwrightConfig } from "./src/configuration/eslint/playwright.config.ts";
import { ignoredConfig } from "./src/configuration/eslint/ignored.config.ts";

export default [
  /**
   * Base (syntax-only) TypeScript rules.
   */
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),

  /**
   * Type-aware rules (restricted to project files).
   */
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.ts", "tests/**/*.ts", "fixtures/**/*.ts", "**/*.spec.ts"],
  })),

  /**
   * Import plugin: handles duplicate imports
   */
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    rules: {
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/extensions": [
        "error",
        "ignorePackages",
        { ts: "never", js: "never" },
      ],
    },
  },

  /**
   * Unused imports plugin
   */
  {
    files: ["**/*.ts"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },

  /**
   * Core TypeScript rules
   */
  {
    files: ["src/**/*.ts", "tests/**/*.ts", "fixtures/**/*.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.url,
      },
    },
    rules: {
      "no-duplicate-imports": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-fallthrough": "error",
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: { arguments: false },
          checksConditionals: true,
          checksSpreads: true,
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },

  /**
   * Playwright rules
   */
  {
    files: ["**/*.spec.ts", "tests/**/*.ts"],
    plugins: {
      playwright,
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/expect-expect": "off",
      "no-console": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  /**
   * Ignored files
   */
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "src/testData/**",
      "logs/**",
      "playwright-report/**",
      "test-results/**",
      ".github",
      ".gitlab",
      ".gitlab-ci",
      ".azure",
      ".azuredevops",
      ".jenkins",
      ".circleci",
      ".travis",
      ".buildkite",
      ".teamcity",
      ".drone",
      ".argo",
      ".ci",
      "ci",
    ],
  },

  /**
   * Prettier
   */
  prettierConfig,
];
