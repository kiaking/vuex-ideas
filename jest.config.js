module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>__tests__/**/*spec.ts'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    "^app/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1"
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', "text-summary", "clover"],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/runtime-test/src/utils/**',
    '!packages/template-explorer/**',
    '!packages/size-check/**'
  ]
}
