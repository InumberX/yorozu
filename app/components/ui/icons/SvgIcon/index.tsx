import * as styles from './style.css'

export const SVG_ICON_VARIANT = {
  ANIMATED_IMAGES: 'animatedImages',
  ARROW_FORWARD: 'arrowForward',
  CHECK: 'check',
  FILTER: 'filter',
  ROUTINE: 'routine',
} as const

export type SvgIconVariant = (typeof SVG_ICON_VARIANT)[keyof typeof SVG_ICON_VARIANT]

type Props = {
  className?: string
  variant: SvgIconVariant
  title?: string
}

export const SvgIcon = ({ className, variant, title }: Props) => {
  return (
    <i
      className={[styles.svgIcon, styles[`svgIcon__${variant}`], className].filter(Boolean).join(' ')}
      title={title}
      aria-label={title}
    />
  )
}
