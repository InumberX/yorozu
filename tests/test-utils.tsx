import { render } from '@testing-library/react'
import { createInstance } from 'i18next'
import { type ReactElement, type ReactNode } from 'react'
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

// プロバイダーは wrapper で包む。戻り値の rerender も同じ wrapper で包むので、
// 状態を変えて描き直すテストは `result.rerender(<Component />)` だけでよい。
export const renderWithProviders = (ui: ReactElement, { route = '/' }: Options = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </I18nextProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

export { testI18n }
