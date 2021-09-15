const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
    rootDir: root,
    displayName: 'root-tests',
    testMatch: ['<rootDir>/test/*.test.ts'],
    testEnvironment: 'node',
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts", "dotenv/config"],
    coverageDirectory: '<rootDir>/test/coverage',
    coverageReporters: ["html"],
    collectCoverageFrom: ["**/*.ts", "!**/node_modules/**", "!**/vendor/**"],
    clearMocks: true,
    preset: 'ts-jest',
}