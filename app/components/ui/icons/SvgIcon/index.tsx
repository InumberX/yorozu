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
  return (
    <i
      className={[styles.svgIcon, styles[`svgIcon__${variant}`], className].filter(Boolean).join(' ')}
      title={title}
      aria-label={title}
    />
  )
}
