import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import playwright from "eslint-plugin-playwright";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

import path from "path";
import { fileURLToPath } from "url";

/**
 * ESM does not expose __dirname natively — derive it from import.meta.url.
 * Required by parserOptions.tsconfigRootDir so ESLint can resolve tsconfig.json
 * relative to this file regardless of where the process is invoked from.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  // ─── All *.ts files (no type information required) ───────────────────────────

  /**
   * Syntax-only TypeScript rules applied broadly.
   * Does not need parserOptions.project, so it safely covers root-level
   * configs and scripts that sit outside the tsconfig include paths.
   */
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),

  /**
   * Prevents duplicate import declarations, including mixed type/value imports.
   * Paired with consistent-type-imports below to enforce the inline-type style.
   * File extensions are banned on TS/JS specifiers — the resolver handles them.
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
   * Auto-removes unused import statements on --fix.
   * Warns on unused variables while honouring the _ prefix convention.
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

  // ─── src/ tests/ fixtures/ only (type-aware) ─────────────────────────────────

  /**
   * Type-aware rules that require a full parse with parserOptions.project.
   * Scoped to project source files only — applying these broadly causes
   * tsconfig resolution errors on files outside the include paths.
   */
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.ts", "tests/**/*.ts", "fixtures/**/*.ts", "**/*.spec.ts"],
  })),

  /**
   * Core type-safety and correctness rules for all production and test code.
   *
   * Key decisions:
   *  - no-duplicate-imports is off — superseded by import/no-duplicates above.
   *  - Unsafe operations (member access, assignment, calls etc.) are hard errors.
   *  - Floating and misused promises are hard errors.
   *  - prefer-nullish-coalescing, no-non-null-assertion, and
   *    restrict-template-expressions are off — too noisy for this codebase.
   */
  {
    files: ["src/**/*.ts", "tests/**/*.ts", "fixtures/**/*.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "no-duplicate-imports": "off", // superseded by import/no-duplicates above
      "no-fallthrough": "error",
      "no-console": ["error", { allow: ["error"] }],

      // Type imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Unused vars (stricter than the broad unused-imports warn above)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Unsafe operations
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-argument": "error",

      // Promise / async safety
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

      // Intentionally relaxed
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },

  // ─── Test files only ──────────────────────────────────────────────────────────

  /**
   * Playwright rules for spec and test files.
   *
   * unsafe-* rules are relaxed — test helpers often need to work with
   * untyped page objects and fixture data where strict typing is impractical.
   *
   * reportUnusedDisableDirectives is set to error so a developer cannot
   * suppress playwright/no-focused-test via an inline eslint-disable comment.
   * The pre-push raw-grep check is the final backstop and cannot be bypassed
   * by any ESLint directive.
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

  // ─── Applied last ─────────────────────────────────────────────────────────────

  /**
   * Paths excluded from all linting.
   * CI provider directories are listed explicitly — ESLint can pick them up
   * when rootDir resolution is broad.
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
   * Disables ESLint formatting rules that would conflict with Prettier.
   * Must be last — it overrides formatting rules set by anything above.
   */
  prettierConfig,
];