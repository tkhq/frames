module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: ["regenerator-runtime/runtime"],
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["node_modules/(?!(@noble|@hpke)/)"],
};
