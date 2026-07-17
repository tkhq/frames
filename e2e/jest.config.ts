import type { Config } from "jest";

export default {
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost",
    resources: 'usable'
  },
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { useESM: true }],
  },
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["<rootDir>/node_modules/.pnpm/(?!(@noble|@hpke)/)"],
} satisfies Config;
