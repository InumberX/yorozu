import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { NotePanel } from '~/components/ui/panels/NotePanel'

describe('NotePanel', () => {
  afterEach(() => {
    cleanup()
  })

  test('注記ごとに h2 と本文を出す', () => {
    const result = render(
      <NotePanel
        items={[
          { title: 'A', text: 'a の本文' },
          { title: 'B', text: 'b の本文' },
        ]}
      />
    )
    const headings = result.getAllByRole('heading', { level: 2 })
    expect(headings.map((heading) => heading.textContent)).toEqual(['A', 'B'])
    expect(result.getByText('b の本文')).not.toBe(null)
  })
})
