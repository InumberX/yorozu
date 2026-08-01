import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import * as VitestConfig from 'vitest/config'

export default VitestConfig.defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // テストがまだ無い間も CI（test ジョブ）を緑に保つ。テスト追加後は不要になる。
    passWithNoTests: true,
    setupFiles: ['./setup-test-env.ts'],
    includeSource: ['app/**/*.{ts,tsx}'],
    exclude: ['node_modules'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
    },
  },
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    assetsInlineLimit: 0,
  },
})
