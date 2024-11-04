module.exports = {
  setupFiles: ["../test/setup-tests.ts"],
  clearMocks: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./test",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  maxWorkers: "50%",
  collectCoverage: false,
  coverageDirectory: "../coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  collectCoverageFrom: [
    "**/*.{ts,js}",
    "!**/types.ts",
    "!**/models/*.ts",
    "!**/entities/*.ts",
    "!database/migrations/*.ts",
    "!database/ormconfig.ts",
    "!**/main.ts",
    "!**/*.module.ts",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/handlers.ts",
    "!**/dotenv.init.ts",
  ],
};
