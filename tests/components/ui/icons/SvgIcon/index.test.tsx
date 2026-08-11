import { render, type RenderResult, cleanup } from '@testing-library/react'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { SVG_ICON_VARIANT, type SvgIconVariant, SvgIcon } from '~/components/ui/icons/SvgIcon'

describe('SvgIcon', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('基本的なアイコン', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} />)
      })

      test('i タグが使用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon).not.toBe(null)
      })

      test('子要素を持たない', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.textContent).toBe('')
      })
    })

    describe('title を指定した場合', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} title="チェック" />)
      })

      test('title が正常に付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('title')).toEqual('チェック')
      })

      test('aria-label が正常に付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.getAttribute('aria-label')).toEqual('チェック')
      })
    })

    describe('title を指定しない場合', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} />)
      })

      test('title 属性は付与されていない', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.hasAttribute('title')).toBe(false)
      })

      test('aria-label 属性は付与されていない', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.hasAttribute('aria-label')).toBe(false)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('ベーススタイル', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} />)
      })

      test('svgIcon クラスが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon')
      })
    })

    describe('animatedImages バリアント', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.ANIMATED_IMAGES} />)
      })

      test('animatedImages バリアントスタイルが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon__animatedImages')
      })
    })

    describe('arrowForward バリアント', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.ARROW_FORWARD} />)
      })

      test('arrowForward バリアントスタイルが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon__arrowForward')
      })
    })

    describe('check バリアント', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} />)
      })

      test('check バリアントスタイルが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon__check')
      })
    })

    describe('filter バリアント', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.FILTER} />)
      })

      test('filter バリアントスタイルが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon__filter')
      })
    })

    describe('routine バリアント', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.ROUTINE} />)
      })

      test('routine バリアントスタイルが適用されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon__routine')
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} className="custom-class" />)
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.classList.contains('custom-class')).toBe(true)
      })

      test('ベーススタイルとバリアントスタイルも維持されている', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className).toContain('svgIcon')
        expect(icon?.className).toContain('svgIcon__check')
      })
    })

    describe('カスタムクラス名を指定しない場合', () => {
      beforeEach(() => {
        result = render(<SvgIcon variant={SVG_ICON_VARIANT.CHECK} />)
      })

      test('余分な空文字クラスが含まれていない', () => {
        const icon = result.container.querySelector('i')
        expect(icon?.className.includes('  ')).toBe(false)
        expect(icon?.className.endsWith(' ')).toBe(false)
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe.skip('Operation', () => {})

  //============================================================================
  // 4. Validation (for forms)
  //============================================================================
  describe.skip('Validation', () => {})

  //============================================================================
  // 5. Others (Optional)
  //============================================================================
  describe('Others (Optional)', () => {
    describe('SVG_ICON_VARIANT 定数', () => {
      test('想定どおりのバリアントが定義されている', () => {
        expect(SVG_ICON_VARIANT).toEqual({
          ANIMATED_IMAGES: 'animatedImages',
          ARROW_FORWARD: 'arrowForward',
          CHECK: 'check',
          FILTER: 'filter',
          ROUTINE: 'routine',
        })
      })

      test('すべてのバリアントで対応するスタイルが適用される', () => {
        const variants = Object.values(SVG_ICON_VARIANT) satisfies SvgIconVariant[]

        variants.forEach((variant) => {
          const { container, unmount } = render(<SvgIcon variant={variant} />)
          const icon = container.querySelector('i')

          expect(icon?.className).toContain(`svgIcon__${variant}`)

          unmount()
        })
      })
    })
  })
})
