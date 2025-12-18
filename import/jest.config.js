module.exports = {
  clearMocks: true,
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["regenerator-runtime/runtime"],
  testPathIgnorePatterns: ["/node_modules/"],
};
