import prettierConfig from "eslint-config-prettier";
import base from "./src/configuration/eslint/base.ts";
import imports from "./src/configuration/eslint/imports.ts";
import playwrightRules from "./src/configuration/eslint/playwright.ts";
import ignores from "./src/configuration/eslint/ignores.ts";

export default [
  ...base,
  ...imports,
  ...playwrightRules,
  ignores,
  prettierConfig,
];
