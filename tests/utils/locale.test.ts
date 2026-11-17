import { type ShouldRevalidateFunctionArgs } from 'react-router'
import { describe, expect, test } from 'vitest'

import { shouldRevalidateOnLangChange } from '~/utils/locale'

const createArgs = (
  currentLang: string | undefined,
  nextLang: string | undefined,
  defaultShouldRevalidate: boolean
): ShouldRevalidateFunctionArgs =>
  ({
    currentUrl: new URL('http://localhost/'),
    nextUrl: new URL('http://localhost/'),
    currentParams: currentLang ? { lang: currentLang } : {},
    nextParams: nextLang ? { lang: nextLang } : {},
    defaultShouldRevalidate,
  }) as ShouldRevalidateFunctionArgs

describe('shouldRevalidateOnLangChange', () => {
  test('JA（接頭辞なし）→ EN で再検証する', () => {
    expect(shouldRevalidateOnLangChange(createArgs(undefined, 'en', false))).toBe(true)
  })

  test('EN → JA（接頭辞なし）で再検証する', () => {
    expect(shouldRevalidateOnLangChange(createArgs('en', undefined, false))).toBe(true)
  })

  test('lang が同じなら既定の判定に従う', () => {
    expect(shouldRevalidateOnLangChange(createArgs('en', 'en', false))).toBe(false)
    expect(shouldRevalidateOnLangChange(createArgs(undefined, undefined, true))).toBe(true)
  })
})
