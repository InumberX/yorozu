import { type FieldMetadata, getInputProps } from '@conform-to/react'
import { type ReactNode, useState } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'

export type InputRangeProps = {
  // Conform のフィールド。min / max / step は zod のスキーマ（getZodConstraint）から受け取る。
  field: FieldMetadata<number | undefined>
  label: ReactNode
  // 目盛りの両端に添える言葉（例: 小さく / きれいに）
  minLabel?: ReactNode
  maxLabel?: ReactNode
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => void
}

const toNumber = (value: unknown): number | undefined => {
  const n = typeof value === 'string' && value !== '' ? Number(value) : NaN
  return Number.isFinite(n) ? n : undefined
}

// 範囲から数値を選ぶスライダー。選んでいる値を見出しの右に表示する。
export const InputRange = ({
  field,
  label,
  minLabel,
  maxLabel,
  helperText,
  isDisabled,
  className,
  onChange,
}: InputRangeProps) => {
  const { key, ...inputProps } = getInputProps(field, {
    type: 'range',
    ariaDescribedBy: helperText ? field.descriptionId : undefined,
  })

  // 表示する値。入力自体は Conform の管理（非制御）のまま、表示のためだけに持つ。
  // フォームがリセットされると key が変わるので、そのときは初期値に戻す。
  const initialValue = toNumber(field.initialValue) ?? toNumber(String(field.min ?? ''))
  const [value, setValue] = useState(initialValue)
  const [previousKey, setPreviousKey] = useState(key)

  if (previousKey !== key) {
    setPreviousKey(key)
    setValue(initialValue)
  }

  const labelId = `${field.id}-label`
  const hasScale = !!minLabel || !!maxLabel

  return (
    <div className={[styles.inputRange, className].filter(Boolean).join(' ')}>
      <div className={styles.inputRange_header}>
        <label id={labelId} htmlFor={field.id} className={styles.inputRange_label}>
          {label}
        </label>
        <output htmlFor={field.id} className={styles.inputRange_value} aria-hidden="true">
          {value}
        </output>
      </div>

      <input
        key={key}
        {...inputProps}
        className={styles.inputRange_input}
        disabled={isDisabled}
        onChange={(event) => {
          const newValue = Number(event.currentTarget.value)
          setValue(newValue)
          onChange?.(event, newValue)
        }}
      />

      {hasScale && (
        <div className={styles.inputRange_scale} aria-hidden="true">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}

      {helperText && (
        <p id={field.descriptionId} className={styles.inputRange_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={field.errorId} errors={field.errors} />
    </div>
  )
}
