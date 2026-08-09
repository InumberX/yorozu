import { type AriaRole, type AriaAttributes, type ReactNode, useMemo } from 'react'
import { Link } from 'react-router'

import * as styles from './style.css'

import type { EventTypes } from '~/types/event'
import type { ButtonType, AnchorTarget, AnchorRel } from '~/types/html'

export type PrimitiveButtonProps = {
  url?: string
  target?: AnchorTarget
  rel?: AnchorRel
  buttonType?: ButtonType
  isDisabled?: boolean
  className?: string
  children?: ReactNode
  onClick?: EventTypes['onClickButton']
  name?: string
  value?: string
  title?: string
  role?: AriaRole
  tabIndex?: number
  ariaLabel?: AriaAttributes['aria-label']
  ariaControls?: AriaAttributes['aria-controls']
  ariaSelected?: AriaAttributes['aria-selected']
}

export const PrimitiveButton = ({
  url,
  target,
  rel,
  buttonType,
  isDisabled,
  className,
  children,
  onClick,
  name,
  value,
  title,
  role,
  tabIndex,
  ariaLabel,
  ariaControls,
  ariaSelected,
}: PrimitiveButtonProps) => {
  // 外部リンク判定
  const isExternal: boolean = useMemo(() => {
    return url ? url.startsWith('http://') || url.startsWith('https://') : false
  }, [url])

  // 内部リンク判定
  const isInternalLink: boolean = useMemo(() => {
    return url ? url.startsWith('#') : false
  }, [url])

  const primitiveButtonClassName = useMemo(() => {
    return [styles.primitiveButton, isDisabled && styles.primitiveButton__disabled, className].filter(Boolean).join(' ')
  }, [isDisabled, className])

  // Button type
  const type = buttonType || 'button'

  // a / Link は disabled 属性を持てないため、無効時はナビゲーションを抑止し、
  // タブ順から外して aria-disabled を付与する（キーボードでの到達・実行を防ぐ）。
  const handleAnchorClick: EventTypes['onClickButton'] = (event) => {
    if (isDisabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return isExternal || isInternalLink ? (
    <a
      href={url}
      target={target}
      rel={rel}
      className={primitiveButtonClassName}
      onClick={handleAnchorClick}
      title={title}
      role={role}
      tabIndex={isDisabled ? -1 : tabIndex}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-selected={ariaSelected}
      aria-disabled={isDisabled || undefined}
    >
      {children}
    </a>
  ) : url ? (
    <Link
      to={url}
      target={target}
      rel={rel}
      className={primitiveButtonClassName}
      onClick={handleAnchorClick}
      title={title}
      role={role}
      tabIndex={isDisabled ? -1 : tabIndex}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-selected={ariaSelected}
      aria-disabled={isDisabled || undefined}
    >
      {children}
    </Link>
  ) : onClick || buttonType ? (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={primitiveButtonClassName}
      name={name}
      value={value}
      title={title}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-selected={ariaSelected}
    >
      {children}
    </button>
  ) : (
    <span
      className={primitiveButtonClassName}
      title={title}
      role={role}
      tabIndex={tabIndex}
      aria-controls={ariaControls}
      aria-selected={ariaSelected}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  )
}
