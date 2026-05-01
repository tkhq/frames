module.exports = {
  clearMocks: true,
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["node_modules/(?!(@hpke)/)"],
};
