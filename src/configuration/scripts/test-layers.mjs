import { execSync } from "child_process";

const role  = process.env.USER_ROLE  || "general-user";
const layer = process.env.TEST_LAYER || "ui";

const layerPaths = {
  ui:  "tests/layers/ui",
  api: "tests/layers/api",
  db:  "tests/layers/db",
};

const path = layerPaths[layer];

if (!path) {
  console.error(`Unknown layer: "${layer}". Available: ${Object.keys(layerPaths).join(", ")}`);
  process.exit(1);
}

console.log(`Running tests | layer: ${layer} | project: ${role}`);

execSync(`npx playwright test ${path} --project=${role}`, {
  stdio: "inherit",
  env: { ...process.env },
});