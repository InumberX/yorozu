import { type getInputProps } from '@conform-to/react'
import { type ReactNode, useState } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'
import { getDescriptionId, getErrorId, joinIds } from '~/utils/form'

export type InputRangeProps = {
  // `getInputProps(fields.x, { type: 'range' })` の戻り値。min / max / step はスキーマから入る。
  inputProps: ReturnType<typeof getInputProps>
  label: ReactNode
  // 目盛りの両端に添える言葉（例: 小さく / きれいに）
  minLabel?: ReactNode
  maxLabel?: ReactNode
  errors?: string[]
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => void
}

const toNumber = (value: unknown): number | undefined => {
  const n = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN
  return value !== '' && Number.isFinite(n) ? n : undefined
}

// 範囲から数値を選ぶスライダー。選んでいる値を見出しの右に表示する。
export const InputRange = ({
  inputProps,
  label,
  minLabel,
  maxLabel,
  errors,
  helperText,
  isDisabled,
  className,
  onChange,
}: InputRangeProps) => {
  const { key, ...props } = inputProps
  const id = props.id ?? ''
  const hasErrors = !!errors?.length

  // 表示する値。入力そのものは Conform の管理（非制御）のまま、表示のためだけに持つ。
  // フォームがリセットされると key が変わるので、そのときは初期値に戻す。
  // 初期値がなければ、ブラウザの既定（min と max の中間）にそろえる。
  const min = toNumber(props.min) ?? 0
  const max = toNumber(props.max) ?? 100
  const initialValue = toNumber(props.defaultValue) ?? min + (max - min) / 2
  const [value, setValue] = useState(initialValue)
  const [previousKey, setPreviousKey] = useState(key)

  if (previousKey !== key) {
    setPreviousKey(key)
    setValue(initialValue)
  }

  const hasScale = !!minLabel || !!maxLabel

  return (
    <div className={[styles.inputRange, className].filter(Boolean).join(' ')}>
      <div className={styles.inputRange_header}>
        <label htmlFor={id} className={styles.inputRange_label}>
          {label}
        </label>
        <output htmlFor={id} className={styles.inputRange_value} aria-hidden="true">
          {value}
        </output>
      </div>

      <input
        key={key}
        {...props}
        type="range"
        className={styles.inputRange_input}
        aria-invalid={hasErrors || undefined}
        aria-describedby={joinIds(hasErrors && getErrorId(id), !!helperText && getDescriptionId(id))}
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
        <p id={getDescriptionId(id)} className={styles.inputRange_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={getErrorId(id)} errors={errors} />
    </div>
  )
}
