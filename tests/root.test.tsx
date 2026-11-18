import { cleanup, render, waitFor } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { createRoutesStub, data } from 'react-router'
import { afterEach, describe, expect, test } from 'vitest'

import { testI18n } from './test-utils'

import { ErrorBoundary, Layout } from '~/root'

// prerender していないパスの 404 は、root の loaderData が SPA フォールバック（JA）のものになる。
// 表示言語・タイトル・<html lang> が URL から決まることを確かめる。
const notFoundLoader = () => {
  throw data(null, { status: 404 })
}

const renderErrorBoundary = (path: string) => {
  const Stub = createRoutesStub([{ path: '*', loader: notFoundLoader, Component: () => null, ErrorBoundary }])
  return render(
    <I18nextProvider i18n={testI18n}>
      <Stub initialEntries={[path]} />
    </I18nextProvider>
  )
}

describe('root', () => {
  afterEach(() => {
    cleanup()
    document.title = ''
  })

  describe('ErrorBoundary（404）', () => {
    test('JA のパスは日本語で表示し、タイトルを出す', async () => {
      const result = renderErrorBoundary('/fr/image')
      expect(await result.findByRole('heading', { level: 1 })).toHaveTextContent('ページが見つかりません')
      await waitFor(() => expect(document.title).toMatch(/^ページが見つかりません \| /))
      expect(result.getByRole('link')).toHaveAttribute('href', '/')
    })

    test('/en 配下は英語で表示し、タイトルを出す', async () => {
      const result = renderErrorBoundary('/en/nope')
      expect(await result.findByRole('heading', { level: 1 })).toHaveTextContent('Page not found')
      await waitFor(() => expect(document.title).toMatch(/^Page not found \| /))
      expect(result.getByRole('link')).toHaveAttribute('href', '/en')
    })
  })

  describe('Layout', () => {
    test.each([
      ['/', 'ja'],
      ['/fr/image', 'ja'],
      ['/en', 'en'],
      ['/en/nope', 'en'],
    ])('%s の <html lang> は %s', (path, lang) => {
      const Stub = createRoutesStub([{ path: '*', Component: () => <Layout>{null}</Layout> }])
      const html = renderToString(
        <I18nextProvider i18n={testI18n}>
          <Stub initialEntries={[path]} />
        </I18nextProvider>
      )
      expect(html).toMatch(new RegExp(`<html lang="${lang}"`))
    })

    test('アイコンと Web App Manifest を読み込む', () => {
      const Stub = createRoutesStub([{ path: '*', Component: () => <Layout>{null}</Layout> }])
      const html = renderToString(
        <I18nextProvider i18n={testI18n}>
          <Stub initialEntries={['/']} />
        </I18nextProvider>
      )
      expect(html).toContain('<link rel="icon" href="/favicon.ico"')
      expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>')
      expect(html).toContain('<link rel="apple-touch-icon" href="/apple-icon.png"')
      expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest"/>')
    })
  })
})
