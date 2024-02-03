/** @type {import('jest').Config} */
const config = {
    transform: {
        "\\.[jt]sx?$": "ts-jest",
    },
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    moduleNameMapper: {
        "(.+)\\.js": "$1",
    },
    extensionsToTreatAsEsm: [".ts"],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: -10,
        },
    },
    collectCoverageFrom: [
        "src/**/*.ts"
    ],
};

export default config;