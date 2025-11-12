const { exec } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const runTestsOnLambdaTest = () => {
  const username = process.env.LT_USERNAME;
  const accessKey = process.env.LT_ACCESS_KEY;

  if (!username || !accessKey) {
    console.error('LambdaTest credentials not found in environment variables');
    process.exit(1);
  }

  console.log('Running tests on LambdaTest...');

  // Generate JUnit report for LambdaTest
  const command = `jest --ci --json --outputFile=test-results.json --testResultsProcessor=jest-junit`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Test Results:\n${stdout}`);
    uploadResultsToLambdaTest();
  });
};

const uploadResultsToLambdaTest = () => {
  console.log('Uploading results to LambdaTest...');
  // Implementation for uploading results
  // This would use LambdaTest's API to upload test results
};

runTestsOnLambdaTest();



module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-reports',
      outputName: 'junit.xml',
      ancestorSeparator: ' › ',
      uniqueOutputName: 'false',
      suiteNameTemplate: '{filepath}',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}'
    }]
  ]
};
