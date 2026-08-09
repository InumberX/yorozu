import { render } from '@testing-library/react'
import { createInstance } from 'i18next'
import { type ReactElement } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { MemoryRouter } from 'react-router'

import { LANG } from '~/config/consts'
import { i18n as i18nSettings } from '~/i18n'

// テスト用の i18n インスタンス（インライン resources のため同期初期化）。
const testI18n = createInstance()
testI18n.use(initReactI18next).init({
  ...i18nSettings,
  lng: LANG.JA,
})

type Options = {
  route?: string
}

export const renderWithProviders = (ui: ReactElement, { route = '/' }: Options = {}) => {
  return render(
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </I18nextProvider>
  )
}

export { testI18n }
