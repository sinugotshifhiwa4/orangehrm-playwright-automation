import tseslint from "typescript-eslint";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Create __dirname in ES module environments.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const base = [
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
   * Core TypeScript rules.
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
      /**
       * Duplicate imports — disabled in favour of import plugin
       */
      "no-duplicate-imports": "off",

      /**
       * Enforce inline type imports (works with import/no-duplicates)
       */
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      /**
       * Core correctness & safety
       */
      "no-fallthrough": "error",
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-argument": "error",

      /**
       * Promise / async safety
       */
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

      /**
       * Pragmatic relaxations
       */
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },
];

export default base;