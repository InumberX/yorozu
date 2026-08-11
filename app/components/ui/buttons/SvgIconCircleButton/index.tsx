import { useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'
import { SvgIcon, type SvgIconProps } from '~/components/ui/icons/SvgIcon'

export type SvgIconCircleButtonProps = PrimitiveButtonProps & {
  icon: SvgIconProps
}

export const SvgIconCircleButton = ({ icon, ...props }: SvgIconCircleButtonProps) => {
  const { isDisabled, className, title } = props
  const svgIconCircleButtonClassName = useMemo(() => {
    return [styles.svgIconCircleButton, isDisabled && styles.svgIconCircleButton__disabled, className]
      .filter(Boolean)
      .join(' ')
  }, [isDisabled, className])

  return (
    <PrimitiveButton ariaLabel={title} {...props} className={svgIconCircleButtonClassName}>
      <SvgIcon {...icon} className={[styles.svgIconCircleButton_icon, icon.className].filter(Boolean).join(' ')} />
    </PrimitiveButton>
  )
}
