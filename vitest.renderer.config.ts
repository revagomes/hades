import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/renderer/src/test/**/*.test.{ts,tsx}'],
    globals: true,
    setupFiles: ['src/renderer/src/test/setup.ts'],
  },
})
