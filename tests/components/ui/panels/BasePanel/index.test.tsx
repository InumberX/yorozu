import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { BasePanel } from '~/components/ui/panels/BasePanel'

describe('BasePanel', () => {
  afterEach(() => {
    cleanup()
  })

  test('既定では div に default の色で出力される', () => {
    const { container } = render(<BasePanel>中身</BasePanel>)
    const panel = container.firstElementChild
    expect(panel?.tagName).toBe('DIV')
    expect(panel?.className).toContain('basePanel__default')
    expect(panel?.textContent).toBe('中身')
  })

  test('tag・color・className を指定できる', () => {
    const { container } = render(
      <BasePanel tag="section" color="dense" className="custom">
        中身
      </BasePanel>
    )
    const panel = container.firstElementChild
    expect(panel?.tagName).toBe('SECTION')
    expect(panel?.className).toContain('basePanel__dense')
    expect(panel?.className).toContain('custom')
  })
})
