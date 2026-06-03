import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer/src')
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/renderer/src/test/**/*.test.{ts,tsx}'],
    globals: true,
    setupFiles: ['src/renderer/src/test/setup.ts'],
  },
})
