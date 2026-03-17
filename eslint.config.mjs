import prettierConfig from "eslint-config-prettier";
import base from "./src/configuration/eslint/base";
import imports from "./src/configuration/eslint/imports";
import playwrightRules from "./src/configuration/eslint/playwright";
import ignores from "./src/configuration/eslint/ignores";

export default [
  ...base,
  ...imports,
  ...playwrightRules,
  ignores,
  prettierConfig,
];
