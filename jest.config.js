module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // Transform ES modules from LambdaTest and SmartUI packages
  // Also transform their dependencies (axios, etc.) that might use ES modules
  transformIgnorePatterns: ["node_modules/(?!(@lambdatest|smartui|axios)/)"],
  // Add module directories to help Jest find modules
  moduleDirectories: ["node_modules", "<rootDir>"],
  testPathIgnorePatterns: [
    "/node_modules/",
    // Skip LambdaTest tests by default (requires credentials)
    // Run with: npm run test:lambdatest or npm run test:smartui
    "lambdatest.spec.js",
  ],
};
