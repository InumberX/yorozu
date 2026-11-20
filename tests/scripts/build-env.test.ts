// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { DEFAULT_SITE_NAME, DEFAULT_SITE_URL, resolveBuildEnv } from '../../scripts/build-env'

describe('resolveBuildEnv', () => {
  describe('デプロイ先（CLOUDFLARE_ENV）があるビルド', () => {
    it.each(['development', 'production'])('%s で SITE_URL が空なら例外を投げる', (target) => {
      expect(() => resolveBuildEnv({ CLOUDFLARE_ENV: target, NODE_ENV: 'production' })).toThrow(/SITE_URL/)
      expect(() => resolveBuildEnv({ CLOUDFLARE_ENV: target, NODE_ENV: 'production', SITE_URL: '  ' })).toThrow(
        /SITE_URL/
      )
    })

    it('SITE_URL があれば、その値を使う', () => {
      const env = resolveBuildEnv({
        CLOUDFLARE_ENV: 'production',
        NODE_ENV: 'production',
        SITE_URL: 'https://yorozu.afterworks.jp',
      })
      expect(env.SITE_URL).toBe('https://yorozu.afterworks.jp')
      expect(env.NODE_ENV).toBe('production')
    })
  })

  describe('デプロイ先のないビルド', () => {
    it('SITE_URL と SITE_NAME は開発用の既定値になる', () => {
      const env = resolveBuildEnv({ NODE_ENV: 'production' })
      expect(env.SITE_URL).toBe(DEFAULT_SITE_URL)
      expect(env.SITE_NAME).toBe(DEFAULT_SITE_NAME)
    })

    it('空の CLOUDFLARE_ENV はデプロイ先なしとして扱う', () => {
      expect(resolveBuildEnv({ CLOUDFLARE_ENV: '' }).SITE_URL).toBe(DEFAULT_SITE_URL)
    })

    it('NODE_ENV がなければ development になる', () => {
      expect(resolveBuildEnv({}).NODE_ENV).toBe('development')
    })
  })

  describe('GOOGLE_ANALYTICS_ID', () => {
    it('渡さなければ空になる（gtag を出さない）', () => {
      expect(resolveBuildEnv({}).GOOGLE_ANALYTICS_ID).toBe('')
      expect(
        resolveBuildEnv({ CLOUDFLARE_ENV: 'production', SITE_URL: 'https://example.com' }).GOOGLE_ANALYTICS_ID
      ).toBe('')
    })

    it('渡した値をそのまま使う', () => {
      expect(resolveBuildEnv({ GOOGLE_ANALYTICS_ID: 'G-TEST' }).GOOGLE_ANALYTICS_ID).toBe('G-TEST')
    })
  })

  describe('SITE_URL の形', () => {
    it('末尾のスラッシュを落とす', () => {
      expect(resolveBuildEnv({ SITE_URL: 'https://example.com/' }).SITE_URL).toBe('https://example.com')
    })

    it.each(['example.com', 'ftp://example.com', 'javascript:alert(1)'])(
      'http(s) の URL でない %s は例外を投げる',
      (siteUrl) => {
        expect(() => resolveBuildEnv({ SITE_URL: siteUrl })).toThrow(/http\(s\)/)
      }
    )
  })
})
