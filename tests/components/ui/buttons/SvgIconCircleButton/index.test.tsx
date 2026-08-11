import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { SvgIconCircleButton } from '~/components/ui/buttons/SvgIconCircleButton'
import { SVG_ICON_VARIANT } from '~/components/ui/icons/SvgIcon'

describe('SvgIconCircleButton', () => {
  let result: RenderResult
  const handleClick: () => void = vi.fn()

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('標準ボタン', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} onClick={() => handleClick()} />
        )
      })

      test('button 要素が出力されている', () => {
        const button = result.container.querySelector('button')
        expect(button).not.toBe(null)
      })

      test('type が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('type')).toEqual('button')
      })

      test('icon で指定したアイコンが出力されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon).not.toBe(null)
        expect(icon?.className).toContain('svgIcon__check')
      })
    })

    describe('icon の指定内容', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton
            icon={{ variant: SVG_ICON_VARIANT.ARROW_FORWARD, title: 'アイコンの説明' }}
            onClick={() => handleClick()}
          />
        )
      })

      test('variant が SvgIcon に引き渡されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon__arrowForward')
      })

      test('title が SvgIcon に引き渡されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('title')).toEqual('アイコンの説明')
        expect(icon?.getAttribute('aria-label')).toEqual('アイコンの説明')
      })
    })

    describe('title を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton
            icon={{ variant: SVG_ICON_VARIANT.CHECK }}
            title="決定する"
            onClick={() => handleClick()}
          />
        )
      })

      test('title が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('title')).toEqual('決定する')
      })

      test('title が aria-label として補完されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('aria-label')).toEqual('決定する')
      })
    })

    describe('ariaLabel を明示した場合', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton
            icon={{ variant: SVG_ICON_VARIANT.CHECK }}
            title="決定する"
            ariaLabel="フォームを送信"
            onClick={() => handleClick()}
          />
        )
      })

      test('明示した ariaLabel が title より優先される', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('aria-label')).toEqual('フォームを送信')
      })
    })

    describe('title を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} onClick={() => handleClick()} />
        )
      })

      test('aria-label 属性は付与されていない', () => {
        const button = result.container.querySelector('button')
        expect(button?.hasAttribute('aria-label')).toBe(false)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('ベーススタイル', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} onClick={() => handleClick()} />
        )
      })

      test('svgIconCircleButton クラスが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton')
      })
    })

    describe('非活性ボタン', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} isDisabled onClick={() => handleClick()} />
        )
      })

      test('disabled 属性が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.getAttribute('disabled')).toEqual('')
      })

      test('非活性スタイルが適用されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton__disabled')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton
            icon={{ variant: SVG_ICON_VARIANT.CHECK }}
            className="custom-class"
            onClick={() => handleClick()}
          />
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.classList.contains('custom-class')).toBe(true)
      })

      test('ベーススタイルも維持されている', () => {
        const button = result.container.querySelector('button')
        expect(button?.className).toContain('svgIconCircleButton')
      })
    })

    describe('内部構造', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} onClick={() => handleClick()} />
        )
      })

      test('SvgIcon が button の直下に出力されている', () => {
        const button = result.container.querySelector('button')
        const icon = button?.firstElementChild
        expect(icon?.tagName).toEqual('I')
      })

      test('icon クラスが SvgIcon に引き渡されている', () => {
        const icon = result.container.querySelector('i[class*="svgIconCircleButton_icon"]')
        expect(icon).not.toBe(null)
      })
    })

    describe('icon にカスタムクラス名を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton
            icon={{ variant: SVG_ICON_VARIANT.CHECK, className: 'custom-icon-class' }}
            onClick={() => handleClick()}
          />
        )
      })

      test('icon のカスタムクラス名が付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.classList.contains('custom-icon-class')).toBe(true)
      })

      test('svgIconCircleButton_icon クラスも維持されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIconCircleButton_icon')
      })

      test('SvgIcon のベーススタイルも維持されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon')
        expect(icon?.className).toContain('svgIcon__check')
      })
    })

    describe('リンクボタンのスタイル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.ARROW_FORWARD }} url="/internal/path" />
          </MemoryRouter>
        )
      })

      test('リンク要素にも SvgIconCircleButton のスタイルが適用されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.className).toContain('svgIconCircleButton')
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('クリックイベント', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} onClick={() => handleClick()} />
        )
      })

      test('クリックイベントが正常に動作している', () => {
        const button = result.container.querySelector('button')

        if (!button) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    describe('非活性ボタンのクリック', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.CHECK }} isDisabled onClick={() => handleClick()} />
        )
      })

      test('非活性状態ではクリックイベントが発火しない', () => {
        const button = result.container.querySelector('button')

        if (!button) {
          throw new Error('The target element was not found.')
        }

        fireEvent.click(button)
        expect(handleClick).not.toHaveBeenCalled()
      })
    })

    describe('内部リンクボタン', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <SvgIconCircleButton icon={{ variant: SVG_ICON_VARIANT.ARROW_FORWARD }} url="/internal/path" />
          </MemoryRouter>
        )
      })

      test('Link コンポーネントが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('/internal/path')
      })
    })

    describe('外部リンクボタン', () => {
      beforeEach(() => {
        result = render(
          <SvgIconCircleButton
            icon={{ variant: SVG_ICON_VARIANT.ARROW_FORWARD }}
            url="https://example.com"
            target="_blank"
            rel="noopener"
          />
        )
      })

      test('a タグが使用されている', () => {
        const link = result.container.querySelector('a')
        expect(link).not.toBe(null)
        expect(link?.getAttribute('href')).toEqual('https://example.com')
      })

      test('target と rel 属性が正常に付与されている', () => {
        const link = result.container.querySelector('a')
        expect(link?.getAttribute('target')).toEqual('_blank')
        expect(link?.getAttribute('rel')).toEqual('noopener')
      })
    })
  })

  //============================================================================
  // 4. Validation (for forms)
  //============================================================================
  describe.skip('Validation', () => {})

  //============================================================================
  // 5. Others (Optional)
  //============================================================================
  describe.skip('Others (Optional)', () => {})
})
