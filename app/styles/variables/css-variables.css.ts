import { createGlobalTheme } from '@vanilla-extract/css'

const changeColorHexToRgb = (hex: string) => {
  const hexValue =
    hex.slice(0, 1) === '#'
      ? hex.length === 4
        ? hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3) + hex.slice(3, 4) + hex.slice(3, 4)
        : hex.slice(1)
      : hex.length === 3
        ? hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3)
        : hex

  return [hexValue.slice(0, 2), hexValue.slice(2, 4), hexValue.slice(4, 6)]
    .map((value) => {
      return parseInt(value, 16)
    })
    .join(', ')
}

// 主色（発光グリーン）の RGB。罫線・面の透明度違いを組み立てるのに使う。
const PRIMARY_RGB = changeColorHexToRgb('#5cffb1')

const getPrimaryAlpha = (alpha: number) => {
  return `rgba(${PRIMARY_RGB}, ${alpha})`
}

// yorozu デザイン案A（ダークテーマ / 発光グリーン）
// 値の出典は docs/design-guideline.md「デザイン案（検討中）> 案A」。
// 画面上で確認するための検証用テーマで、まだ確定ではない。
// 別案へ差し替える場合もこのファイルの値の入れ替えで済むようにしている。
export const cssVariableColors = {
  font: {
    // 本文
    base: {
      hex: '#8fefc4',
      rgb: changeColorHexToRgb('#8fefc4'),
    },
    // 見出し
    heading: {
      hex: '#e6fff3',
      rgb: changeColorHexToRgb('#e6fff3'),
    },
    // 暗い面の上に置く最も明るい文字
    light: {
      hex: '#e6fff3',
      rgb: changeColorHexToRgb('#e6fff3'),
    },
    // 発光色の面（塗りボタンなど）の上に置く文字
    dark: {
      hex: '#04070a',
      rgb: changeColorHexToRgb('#04070a'),
    },
    // 主色（発光グリーン）
    primary: {
      hex: '#5cffb1',
      rgb: changeColorHexToRgb('#5cffb1'),
    },
    // グロー
    primaryDark: {
      hex: '#2bff9e',
      rgb: changeColorHexToRgb('#2bff9e'),
    },
    // ハイライト
    primaryLight: {
      hex: '#c8ffe6',
      rgb: changeColorHexToRgb('#c8ffe6'),
    },
    // 副文
    sub: {
      hex: '#6fbf9b',
      rgb: changeColorHexToRgb('#6fbf9b'),
    },
    // ラベル
    subDark: {
      hex: '#3e8c6c',
      rgb: changeColorHexToRgb('#3e8c6c'),
    },
    // 減光
    dim: {
      hex: '#2f6b53',
      rgb: changeColorHexToRgb('#2f6b53'),
    },
    mark: {
      hex: '#04070a',
      rgb: changeColorHexToRgb('#04070a'),
    },
    placeholder: {
      hex: '#3e8c6c',
      rgb: changeColorHexToRgb('#3e8c6c'),
    },
    // 無効・LOCKED
    disabled: {
      hex: '#2a5d49',
      rgb: changeColorHexToRgb('#2a5d49'),
    },
    // 案A に状態色の指定がないため暫定。確定時に差し替える。
    error: {
      hex: '#ff6b6b',
      rgb: changeColorHexToRgb('#ff6b6b'),
    },
    required: {
      hex: '#ff6b6b',
      rgb: changeColorHexToRgb('#ff6b6b'),
    },
  },
  background: {
    // 背景
    body: {
      hex: '#04070a',
      rgb: changeColorHexToRgb('#04070a'),
    },
    // パネル（カード面）
    light: {
      hex: '#060b0e',
      rgb: changeColorHexToRgb('#060b0e'),
    },
    panel: {
      hex: '#060b0e',
      rgb: changeColorHexToRgb('#060b0e'),
    },
    // 最暗
    darkest: {
      hex: '#050809',
      rgb: changeColorHexToRgb('#050809'),
    },
    primary: {
      hex: '#5cffb1',
      rgb: changeColorHexToRgb('#5cffb1'),
    },
    primaryLight: {
      hex: '#c8ffe6',
      rgb: changeColorHexToRgb('#c8ffe6'),
    },
    sub: {
      hex: '#050809',
      rgb: changeColorHexToRgb('#050809'),
    },
    subDark: {
      hex: '#17342a',
      rgb: changeColorHexToRgb('#17342a'),
    },
    subLight: {
      hex: '#050809',
      rgb: changeColorHexToRgb('#050809'),
    },
    mark: {
      hex: '#5cffb1',
      rgb: changeColorHexToRgb('#5cffb1'),
    },
    // 無効・LOCKED
    disabled: {
      hex: '#1f4536',
      rgb: changeColorHexToRgb('#1f4536'),
    },
    success: {
      hex: '#2bff9e',
      rgb: changeColorHexToRgb('#2bff9e'),
    },
    successLight: {
      hex: '#0d2b20',
      rgb: changeColorHexToRgb('#0d2b20'),
    },
    error: {
      hex: '#ff6b6b',
      rgb: changeColorHexToRgb('#ff6b6b'),
    },
    errorLight: {
      hex: '#2a1113',
      rgb: changeColorHexToRgb('#2a1113'),
    },
  },
  border: {
    primary: {
      hex: '#5cffb1',
      rgb: changeColorHexToRgb('#5cffb1'),
    },
    secondary: {
      hex: '#2bff9e',
      rgb: changeColorHexToRgb('#2bff9e'),
    },
    sub: {
      hex: '#17342a',
      rgb: changeColorHexToRgb('#17342a'),
    },
    subDark: {
      hex: '#22503f',
      rgb: changeColorHexToRgb('#22503f'),
    },
    error: {
      hex: '#ff6b6b',
      rgb: changeColorHexToRgb('#ff6b6b'),
    },
  },
  // 罫線: rgba(92, 255, 177, 0.14 / 0.22 / 0.28 / 0.35 / 0.4)
  line: {
    level1: getPrimaryAlpha(0.14),
    level2: getPrimaryAlpha(0.22),
    level3: getPrimaryAlpha(0.28),
    level4: getPrimaryAlpha(0.35),
    level5: getPrimaryAlpha(0.4),
  },
  // 面: rgba(92, 255, 177, 0.02〜0.05)
  surface: {
    level1: getPrimaryAlpha(0.02),
    level2: getPrimaryAlpha(0.03),
    level3: getPrimaryAlpha(0.04),
    level4: getPrimaryAlpha(0.05),
  },
  gradation: {
    primary: '#5cffb1 0, #2bff9e 100%',
    primaryDark: '#2bff9e 0, #1fd68a 100%',
  },
  // Please use the following sites for key names
  // https://chir.ag/projects/name-that-color/
  util: {
    black: {
      hex: '#000',
      rgb: changeColorHexToRgb('#000'),
    },
  },
  skeleton: {
    sub: {
      hex: '#0f2a20',
      rgb: changeColorHexToRgb('#0f2a20'),
    },
  },
} as const

export const cssVariables = createGlobalTheme(':root', {
  // Define colors to be used
  color: cssVariableColors,
  shadow: {
    // 発光表現。主色をぼかして面の外側へ光を漏らす。
    glow: `0 0 24px ${getPrimaryAlpha(0.24)}`,
    glowStrong: `0 0 32px ${getPrimaryAlpha(0.4)}`,
    text: `0 0 20px ${getPrimaryAlpha(0.45)}`,
  },
  font: {
    family: {
      // 和文・見出し
      main: '"Zen Kaku Gothic New", "游ゴシック Medium", "Yu Gothic", YuGothic, YuGothicMedium, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
      // 英数字・ラベル・数値。Share Tech Mono に和文グリフがないため、
      // 和文は末尾の Zen Kaku Gothic New へフォールバックさせる。
      mono: '"Share Tech Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Zen Kaku Gothic New", "Hiragino Kaku Gothic ProN", Meiryo, monospace',
    },
    weight: {
      // thin: '100',
      // extraLight: '200',
      // light: '300',
      regular: '400',
      medium: '500',
      // semiBold: '600',
      bold: '700',
      // extraBold: '800',
      black: '900',
    },
  },
  opacity: {
    hover: '0.6',
    disabled: '0.4',
  },
  layout: {
    inner: {
      width: {
        large: '1400px',
      },
      padding: {
        xs: '4vw',
        sm: '4.6vw',
        md: '32px',
      },
      maxWidth: {
        large: '1400px + (32px * 2)',
      },
    },
    header: {},
  },
  scale: {
    hover: '1.16',
  },
  leadingTrim: 'calc((1em - 1lh) / 2)',
  zIndex: {
    header: {
      wrapper: '10000',
      global: '10100',
      bar: '10200',
    },
  },
})
