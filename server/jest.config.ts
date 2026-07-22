import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.ts"],
  testPathIgnorePatterns: [".*load-test.*"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          allowImportingTsExtensions: false,
          verbatimModuleSyntax: false,
          noEmit: false,
        },
      },
    ],
  },
  testTimeout: 3_600_000,
};

export default config;
