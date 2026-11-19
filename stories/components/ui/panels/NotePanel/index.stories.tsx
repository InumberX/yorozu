import type { Meta, StoryObj } from '@storybook/react-vite'

import { NotePanel } from '~/components/ui/panels/NotePanel'

const meta: Meta<typeof NotePanel> = {
  title: 'components/ui/panels/NotePanel',
  component: NotePanel,
  args: {
    items: [
      { title: '対応形式と上限', text: 'PNG・JPEG を読み込めます。1ファイル 20MB までです。' },
      {
        title: 'プライバシー',
        text: 'ファイルはブラウザ内で処理され、外部には送信されません。タブを閉じるとデータは破棄されます。',
      },
    ],
  },
}
export default meta

type Story = StoryObj<typeof NotePanel>

export const Default: Story = {}
