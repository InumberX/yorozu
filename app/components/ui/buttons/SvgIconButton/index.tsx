import { useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'
import { SvgIcon, type SvgIconProps } from '~/components/ui/icons/SvgIcon'

export type SvgIconButtonProps = PrimitiveButtonProps & {
  icon: SvgIconProps
}

export const SvgIconButton = ({ icon, ...props }: SvgIconButtonProps) => {
  const { isDisabled, className, title } = props
  const svgIconButtonClassName = useMemo(() => {
    return [styles.svgIconButton, isDisabled && styles.svgIconButton__disabled, className].filter(Boolean).join(' ')
  }, [isDisabled, className])

  return (
    <PrimitiveButton ariaLabel={title} {...props} className={svgIconButtonClassName}>
      <SvgIcon {...icon} className={[styles.svgIconButton_icon, icon.className].filter(Boolean).join(' ')} />
    </PrimitiveButton>
  )
}
