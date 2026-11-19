import { type getInputProps } from '@conform-to/react'
import { type ReactNode } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'
import { getDescriptionId, getErrorId, joinIds } from '~/utils/form'

export type InputCheckboxProps = {
  // `getInputProps(fields.x, { type: 'checkbox' })` の戻り値
  inputProps: ReturnType<typeof getInputProps>
  label: ReactNode
  errors?: string[]
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => void
}

// ON / OFF を 1 つだけ選ぶチェックボックス。
// 本物の input を見えない形で重ね、見た目の枠は input の状態（:checked など）から描く。
export const InputCheckbox = ({
  inputProps,
  label,
  errors,
  helperText,
  isDisabled,
  className,
  onChange,
}: InputCheckboxProps) => {
  const { key, ...props } = inputProps
  const id = props.id ?? ''
  const hasErrors = !!errors?.length

  return (
    <div className={[styles.inputCheckbox, className].filter(Boolean).join(' ')}>
      <label className={styles.inputCheckbox_label}>
        <input
          key={key}
          {...props}
          type="checkbox"
          className={styles.inputCheckbox_input}
          aria-invalid={hasErrors || undefined}
          aria-describedby={joinIds(hasErrors && getErrorId(id), !!helperText && getDescriptionId(id))}
          disabled={isDisabled}
          onChange={(event) => {
            onChange?.(event, event.currentTarget.checked)
          }}
        />
        <span aria-hidden="true" className={styles.inputCheckbox_box} />
        <span className={styles.inputCheckbox_text}>{label}</span>
      </label>

      {helperText && (
        <p id={getDescriptionId(id)} className={styles.inputCheckbox_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={getErrorId(id)} errors={errors} />
    </div>
  )
}
