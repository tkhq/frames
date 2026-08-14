const path = require("path");

module.exports = {
  clearMocks: true,
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["regenerator-runtime/runtime"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@shared/(.*)$": path.resolve(__dirname, "../shared/$1"),
  },
  // Allow modules imported via @shared/* (which live outside <rootDir>) to
  // resolve their own dependencies (e.g. bech32) from import/node_modules.
  modulePaths: [path.resolve(__dirname, "node_modules")],
};
