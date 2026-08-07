import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  reactHooks.configs.flat["recommended-latest"],
  globalIgnores([".next/**", "out/**", "work/**"]),
]);
