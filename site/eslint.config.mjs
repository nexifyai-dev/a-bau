import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // YAML-Daten (src/data/*.yaml) sind bewusst untypisiert geladen (generische Abstraktion, C.7);
  // konkrete Typen würden pro YAML-Datei Interfaces duplizieren (YAGNI). Daher any als Warnung statt Fehler.
  { rules: { "@typescript-eslint/no-explicit-any": "warn" } },
  // Default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
