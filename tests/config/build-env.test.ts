// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { assertDeployBuildEnv, DEFAULT_SITE_NAME, DEFAULT_SITE_URL, resolveBuildEnv } from '~/config/build-env'

const BUILD = { isBuild: true }
const SERVE = { isBuild: false }
const SITE_URL = 'https://yorozu.afterworks.jp'

describe('resolveBuildEnv', () => {
  describe('SITE_URL', () => {
    it('CLOUDFLARE_ENV があっても、値が空なら既定値になる（必須かどうかは assertDeployBuildEnv で確かめる）', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production' }, BUILD).SITE_URL).toBe(DEFAULT_SITE_URL)
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development' }, SERVE).SITE_URL).toBe(DEFAULT_SITE_URL)
    })

    it('値があれば、その値を使う', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL }, BUILD).SITE_URL).toBe(SITE_URL)
    })

    it('前後の空白と末尾のスラッシュを落とす', () => {
      expect(resolveBuildEnv({ SITE_URL: ' https://example.com/ ' }, BUILD).SITE_URL).toBe('https://example.com')
    })

    it.each(['example.com', 'ftp://example.com', 'javascript:alert(1)'])(
      'http(s) の URL でない %s は例外を投げる',
      (siteUrl) => {
        expect(() => resolveBuildEnv({ SITE_URL: siteUrl }, BUILD)).toThrow(/http\(s\)/)
      }
    )
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

  describe('NO_INDEX', () => {
    it('staging のデプロイで空なら true にする', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development', SITE_URL }, BUILD).NO_INDEX).toBe('true')
    })

    it('staging のデプロイでも、明示した false はそのまま使う', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development', SITE_URL, NO_INDEX: 'false' }, BUILD).NO_INDEX).toBe(
        'false'
      )
    })

    it('本番のデプロイ、デプロイしないビルド、開発サーバーでは空のまま', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL }, BUILD).NO_INDEX).toBe('')
      expect(resolveBuildEnv({}, BUILD).NO_INDEX).toBe('')
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'development' }, SERVE).NO_INDEX).toBe('')
    })

    it.each(['TRUE', '1', 'yes'])('%s は例外を投げる', (noIndex) => {
      expect(() => resolveBuildEnv({ NO_INDEX: noIndex }, BUILD)).toThrow(/NO_INDEX/)
    })
  })

  describe('GOOGLE_ANALYTICS_ID', () => {
    it('渡さなければ空になる（gtag を出さない）', () => {
      expect(resolveBuildEnv({}, BUILD).GOOGLE_ANALYTICS_ID).toBe('')
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL }, BUILD).GOOGLE_ANALYTICS_ID).toBe('')
    })

    it('渡した値を、前後の空白を落として使う', () => {
      expect(resolveBuildEnv({ GOOGLE_ANALYTICS_ID: ' G-TEST ' }, BUILD).GOOGLE_ANALYTICS_ID).toBe('G-TEST')
    })
  })

  describe('NODE_ENV と SITE_NAME', () => {
    it('空なら開発用の既定値になる', () => {
      const env = resolveBuildEnv({ NODE_ENV: ' ', SITE_NAME: ' ' }, BUILD)
      expect(env.NODE_ENV).toBe('development')
      expect(env.SITE_NAME).toBe(DEFAULT_SITE_NAME)
    })
  })
})
