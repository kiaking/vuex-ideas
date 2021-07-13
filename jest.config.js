module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>__tests__/**/*spec.ts'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/__tests__/$1"
  },
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', "text-summary", "clover"],
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
}
