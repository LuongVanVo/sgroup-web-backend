/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts"],
    clearMocks: true,
    verbose: true,
    moduleFileExtensions: ["ts", "js", "json", "node"],
    roots: ["<rootDir>/src"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
}