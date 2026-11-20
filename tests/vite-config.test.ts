// @vitest-environment node
import type { Plugin, PluginOption } from 'vite'
import { describe, expect, it } from 'vitest'

import viteConfig from '../vite.config'

const flattenPlugins = (plugins: PluginOption[]): Plugin[] =>
  plugins.flatMap((plugin) => {
    if (Array.isArray(plugin)) {
      return flattenPlugins(plugin)
    }
    return plugin && typeof plugin === 'object' && 'name' in plugin ? [plugin] : []
  })

describe('vite.config', () => {
  it('デプロイするビルドの環境変数を確かめるプラグインを持つ', async () => {
    if (typeof viteConfig !== 'function') {
      throw new Error('vite.config は関数で設定を返す前提')
    }
    const config = await viteConfig({ command: 'build', mode: 'production' })
    const names = flattenPlugins(config.plugins ?? []).map((plugin) => plugin.name)

    expect(names).toContain('yorozu:assert-deploy-build-env')
  })
})
