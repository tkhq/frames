import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

declare module 'vitest' {
    export interface ProvidedContext {
        EXPORT_AND_SIGN_IFRAME_URL: string
        ORGANIZATION_ID: string | undefined,
        API_PUBLIC_KEY: string | undefined,
        API_PRIVATE_KEY: string | undefined,
        BASE_URL: string | undefined,
    }
}

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
        { browser: 'chromium' },
      ],
    },
    provide: {
      EXPORT_AND_SIGN_IFRAME_URL: process.env.EXPORT_AND_SIGN_IFRAME_URL || "http://localhost:8086",
      ORGANIZATION_ID: process.env.ORGANIZATION_ID,
      API_PUBLIC_KEY: process.env.API_PUBLIC_KEY,
      API_PRIVATE_KEY: process.env.API_PRIVATE_KEY,
      BASE_URL: process.env.BASE_URL,
    },
  }
})
