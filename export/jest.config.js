const path = require("path");

module.exports = {
  clearMocks: true,
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["regenerator-runtime/runtime"],
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@noble/ed25519|@noble/hashes|@hpke/core)/)",
  ],
  modulePaths: ["<rootDir>/node_modules"],
  moduleNameMapper: {
    "^@shared/(.*)$": path.resolve(__dirname, "../shared/$1"),
  },
};
