import * as styles from './style.css'

export const SVG_ICON_VARIANT = {
  ANIMATED_IMAGES: 'animatedImages',
  CHEVRON_FORWARD: 'chevronForward',
  CHECK: 'check',
  FILTER: 'filter',
} as const

export type SvgIconVariant = (typeof SVG_ICON_VARIANT)[keyof typeof SVG_ICON_VARIANT]

export type SvgIconProps = {
  className?: string
  variant: SvgIconVariant
  title?: string
}

export const SvgIcon = ({ className, variant, title }: SvgIconProps) => {
  // 説明（title）があるときだけ画像として読み上げ、ないときは装飾として読み上げから外す。
  // role の無い要素に付けた aria-label は、支援技術によっては読み上げられないため。
  return (
    <i
      className={[styles.svgIcon, styles[`svgIcon__${variant}`], className].filter(Boolean).join(' ')}
      title={title}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  )
}
