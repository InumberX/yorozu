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

// yorozu ブランドカラー
// - ベース      : #F4F4F4（背景・下地）
// - プライマリー : #0F1B2D（文字・主要UI・締めの濃紺）
// - セカンダリー : #C9A86A（アクセント・リンク・装飾のゴールド）
export const cssVariableColors = {
  font: {
    base: {
      hex: '#0f1b2d',
      rgb: changeColorHexToRgb('#0f1b2d'),
    },
    light: {
      hex: '#fff',
      rgb: changeColorHexToRgb('#fff'),
    },
    primary: {
      hex: '#c9a86a',
      rgb: changeColorHexToRgb('#c9a86a'),
    },
    primaryDark: {
      hex: '#b0904f',
      rgb: changeColorHexToRgb('#b0904f'),
    },
    sub: {
      hex: '#5b6472',
      rgb: changeColorHexToRgb('#5b6472'),
    },
    subDark: {
      hex: '#33415a',
      rgb: changeColorHexToRgb('#33415a'),
    },
    mark: {
      hex: '#fff',
      rgb: changeColorHexToRgb('#fff'),
    },
    placeholder: {
      hex: '#9aa1ac',
      rgb: changeColorHexToRgb('#9aa1ac'),
    },
    error: {
      hex: '#f44336',
      rgb: changeColorHexToRgb('#f44336'),
    },
    required: {
      hex: '#d42020',
      rgb: changeColorHexToRgb('#d42020'),
    },
  },
  background: {
    body: {
      hex: '#f4f4f4',
      rgb: changeColorHexToRgb('#f4f4f4'),
    },
    light: {
      hex: '#fff',
      rgb: changeColorHexToRgb('#fff'),
    },
    primary: {
      hex: '#0f1b2d',
      rgb: changeColorHexToRgb('#0f1b2d'),
    },
    primaryLight: {
      hex: '#e6eaf0',
      rgb: changeColorHexToRgb('#e6eaf0'),
    },
    sub: {
      hex: '#d8dbe0',
      rgb: changeColorHexToRgb('#d8dbe0'),
    },
    subDark: {
      hex: '#5b6472',
      rgb: changeColorHexToRgb('#5b6472'),
    },
    subLight: {
      hex: '#f4f4f4',
      rgb: changeColorHexToRgb('#f4f4f4'),
    },
    mark: {
      hex: '#0f1b2d',
      rgb: changeColorHexToRgb('#0f1b2d'),
    },
    success: {
      hex: '#35c379',
      rgb: changeColorHexToRgb('#35c379'),
    },
    successLight: {
      hex: '#e3f9ed',
      rgb: changeColorHexToRgb('#e3f9ed'),
    },
    error: {
      hex: '#f44336',
      rgb: changeColorHexToRgb('#f44336'),
    },
    errorLight: {
      hex: '#f7e3e1',
      rgb: changeColorHexToRgb('#f7e3e1'),
    },
  },
  border: {
    primary: {
      hex: '#0f1b2d',
      rgb: changeColorHexToRgb('#0f1b2d'),
    },
    secondary: {
      hex: '#c9a86a',
      rgb: changeColorHexToRgb('#c9a86a'),
    },
    sub: {
      hex: '#d8dbe0',
      rgb: changeColorHexToRgb('#d8dbe0'),
    },
    subDark: {
      hex: '#9aa1ac',
      rgb: changeColorHexToRgb('#9aa1ac'),
    },
    error: {
      hex: '#f44336',
      rgb: changeColorHexToRgb('#f44336'),
    },
  },
  gradation: {
    primary: 'oklch(76% 0.08 85) 0, oklch(84% 0.06 90) 100%',
    primaryDark: 'oklch(68% 0.09 82) 0, oklch(76% 0.08 88) 100%',
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
      hex: '#e7e7e7',
      rgb: changeColorHexToRgb('#e7e7e7'),
    },
  },
} as const

export const cssVariables = createGlobalTheme(':root', {
  // Define colors to be used
  color: cssVariableColors,
  shadow: {},
  font: {
    family: {
      main: '"游ゴシック Medium", "Yu Gothic", YuGothic, YuGothicMedium, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
    },
    weight: {
      // thin: '100',
      // extraLight: '200',
      // light: '300',
      // regular: '400',
      medium: '500',
      // semiBold: '600',
      bold: '700',
      // extraBold: '800',
      // black: '900',
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
