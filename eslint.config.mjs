import prettierConfig from "eslint-config-prettier";
import base from "./src/configuration/eslint/base.js";
import imports from "./src/configuration/eslint/imports.js";
import playwrightRules from "./src/configuration/eslint/playwright.js";
import ignores from "./src/configuration/eslint/ignores.js";

export default [
  ...base,
  ...imports,
  ...playwrightRules,
  ignores,
  prettierConfig,
];
