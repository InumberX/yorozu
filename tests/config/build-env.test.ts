// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  assertDeployBuildEnv,
  assertDeployBuildEnvPlugin,
  DEFAULT_SITE_NAME,
  DEFAULT_SITE_URL,
  resolveBuildEnv,
} from '~/config/build-env'

const SITE_URL = 'https://yorozu.afterworks.jp'

describe('resolveBuildEnv', () => {
  describe('SITE_URL', () => {
    it('CLOUDFLARE_ENV があっても、値が空なら既定値になる（必須かどうかは assertDeployBuildEnv で確かめる）', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production' }).SITE_URL).toBe(DEFAULT_SITE_URL)
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development' }).SITE_URL).toBe(DEFAULT_SITE_URL)
    })

    it('値があれば、その値を使う', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL }).SITE_URL).toBe(SITE_URL)
    })

    it('前後の空白と末尾のスラッシュを落とす', () => {
      expect(resolveBuildEnv({ SITE_URL: ' https://example.com/ ' }).SITE_URL).toBe('https://example.com')
    })

    it.each(['example.com', 'ftp://example.com', 'javascript:alert(1)'])(
      'http(s) の URL でない %s は例外を投げる',
      (siteUrl) => {
        expect(() => resolveBuildEnv({ SITE_URL: siteUrl })).toThrow(/http\(s\)/)
      }
    )
  })

  describe('NO_INDEX', () => {
    it('staging（CLOUDFLARE_ENV=development）で空なら true にする', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development', SITE_URL }).NO_INDEX).toBe('true')
    })

    it('staging（CLOUDFLARE_ENV=development）でも、明示した false はそのまま使う', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development', SITE_URL, NO_INDEX: 'false' }).NO_INDEX).toBe('false')
    })

    it('本番（CLOUDFLARE_ENV=production）とデプロイ先なしでは空のまま', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL }).NO_INDEX).toBe('')
      expect(resolveBuildEnv({}).NO_INDEX).toBe('')
    })

    it.each(['TRUE', '1', 'yes'])('%s は例外を投げる', (noIndex) => {
      expect(() => resolveBuildEnv({ NO_INDEX: noIndex })).toThrow(/NO_INDEX/)
    })
  })

  describe('GOOGLE_ANALYTICS_ID', () => {
    it('渡さなければ空になる（gtag を出さない）', () => {
      expect(resolveBuildEnv({}).GOOGLE_ANALYTICS_ID).toBe('')
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL }).GOOGLE_ANALYTICS_ID).toBe('')
    })

    it('渡した値を、前後の空白を落として使う', () => {
      expect(resolveBuildEnv({ GOOGLE_ANALYTICS_ID: ' G-TEST ' }).GOOGLE_ANALYTICS_ID).toBe('G-TEST')
    })
  })

  describe('NODE_ENV と SITE_NAME', () => {
    it('空なら開発用の既定値になる', () => {
      const env = resolveBuildEnv({ NODE_ENV: ' ', SITE_NAME: ' ' })
      expect(env.NODE_ENV).toBe('development')
      expect(env.SITE_NAME).toBe(DEFAULT_SITE_NAME)
    })
  })
})

describe('assertDeployBuildEnv', () => {
  it.each(['development', 'production'])('デプロイ先（%s）があり SITE_URL が空なら例外を投げる', (target) => {
    expect(() => assertDeployBuildEnv({ CLOUDFLARE_ENV: target })).toThrow(/SITE_URL/)
    expect(() => assertDeployBuildEnv({ CLOUDFLARE_ENV: target, SITE_URL: '  ' })).toThrow(/SITE_URL/)
  })

  it('デプロイ先があり SITE_URL があれば通す', () => {
    expect(() => assertDeployBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL })).not.toThrow()
  })

  it('デプロイ先がなければ、SITE_URL が空でも通す', () => {
    expect(() => assertDeployBuildEnv({})).not.toThrow()
    expect(() => assertDeployBuildEnv({ CLOUDFLARE_ENV: '  ' })).not.toThrow()
  })
})

describe('assertDeployBuildEnvPlugin', () => {
  it('vite build のときだけ使われる', () => {
    expect(assertDeployBuildEnvPlugin({}).apply).toBe('build')
  })

  it('buildStart で assertDeployBuildEnv を確かめる', () => {
    const runBuildStart = (env: Record<string, string>) => {
      const { buildStart } = assertDeployBuildEnvPlugin(env)
      if (typeof buildStart !== 'function') {
        throw new Error('buildStart が関数ではありません')
      }
      // buildStart は this（プラグインの文脈）を使わない。
      return buildStart.call({} as never, {} as never)
    }

    expect(() => runBuildStart({ CLOUDFLARE_ENV: 'production' })).toThrow(/SITE_URL/)
    expect(() => runBuildStart({ CLOUDFLARE_ENV: 'production', SITE_URL })).not.toThrow()
  })
})
