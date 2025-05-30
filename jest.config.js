module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: { '^@/app/(.*)$': '<rootDir>/app/$1'},
  testMatch: ['**/tests/**/*.test.ts'], // Matches your test file
  moduleFileExtensions: ['ts', 'js'], // Recognizes TypeScript and JavaScript
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transforms TypeScript files
  },
};
