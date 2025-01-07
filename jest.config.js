/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
        "\\\\node_modules\\\\",
        "\\\\dist\\\\",
        "\\\\build\\\\",
    ],
    coverageProvider: "v8",
    coverageReporters: [
        "json",
        "text",
    ],
    errorOnDeprecated: true,
    fakeTimers: {
        "enableGlobally": true
    },
    globals: {},
    maxWorkers: "50%",
    moduleDirectories: [
        "node_modules"
    ],
    moduleFileExtensions: [
        "js",
        "mjs",
        "cjs",
        "jsx",
        "ts",
        "tsx",
        "json",
        "node"
    ],
    notify: true,
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|__tests__).[tj]s?(x)"
    ],
    testPathIgnorePatterns: [
        "\\\\node_modules\\\\",
        "\\\\dist\\\\",
        "\\\\build\\\\",
    ],
    watchman: true,
};