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

const serverErrorLoader = () => {
  throw data(null, { status: 500 })
}

const thrownErrorLoader = () => {
  throw new Error('boom')
}

const renderErrorBoundary = (path: string, loader: () => never = notFoundLoader) => {
  const Stub = createRoutesStub([{ path: '*', loader, Component: () => null, ErrorBoundary }])
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

  describe('ErrorBoundary（404 以外）', () => {
    test('500 は「問題が発生しました」と説明を日本語で出す', async () => {
      const result = renderErrorBoundary('/image', serverErrorLoader)
      expect(await result.findByRole('heading', { level: 1 })).toHaveTextContent('問題が発生しました')
      expect(
        result.getByText('ページを表示できませんでした。ページを再読み込みするか、時間をおいてもう一度お試しください。')
      ).toBeInTheDocument()
      await waitFor(() => expect(document.title).toMatch(/^問題が発生しました \| /))
      expect(result.getByRole('link', { name: 'トップへ戻る' })).toHaveAttribute('href', '/')
    })

    test('例外は /en 配下なら英語で出し、例外の中身は出さない', async () => {
      const result = renderErrorBoundary('/en/image', thrownErrorLoader)
      expect(await result.findByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong')
      expect(result.getByText(/Reload the page, or wait a moment and try again\./)).toBeInTheDocument()
      expect(result.queryByText(/boom/)).not.toBeInTheDocument()
      await waitFor(() => expect(document.title).toMatch(/^Something went wrong \| /))
      expect(result.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en')
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
