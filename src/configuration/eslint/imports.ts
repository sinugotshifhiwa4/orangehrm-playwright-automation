import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const imports = [
  /**
   * Import plugin: handles duplicate imports including type vs value imports.
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
    },
  },

  /**
   * Unused imports plugin: only handles unused imports.
   * Unused vars are handled by @typescript-eslint/no-unused-vars.
   */
  {
    files: ["**/*.ts"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      // Disabled in favour of @typescript-eslint/no-unused-vars
      "unused-imports/no-unused-vars": "off",
    },
  },
];

export default imports;