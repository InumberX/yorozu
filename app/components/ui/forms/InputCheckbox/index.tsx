import { type FieldMetadata, getInputProps } from '@conform-to/react'
import { type ReactNode } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'

export type InputCheckboxProps = {
  // Conform のフィールド。値は on / off の 1 つ（zod では `z.boolean().optional()`）。
  field: FieldMetadata<boolean | undefined>
  label: ReactNode
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => void
}

// ON / OFF を 1 つだけ選ぶチェックボックス。
// 本物の input を見えない形で重ね、見た目の枠は input の状態（:checked など）から描く。
export const InputCheckbox = ({ field, label, helperText, isDisabled, className, onChange }: InputCheckboxProps) => {
  const { key, ...inputProps } = getInputProps(field, {
    type: 'checkbox',
    ariaDescribedBy: helperText ? field.descriptionId : undefined,
  })

  return (
    <div className={[styles.inputCheckbox, className].filter(Boolean).join(' ')}>
      <label className={styles.inputCheckbox_label}>
        <input
          key={key}
          {...inputProps}
          className={styles.inputCheckbox_input}
          disabled={isDisabled}
          onChange={(event) => {
            onChange?.(event, event.currentTarget.checked)
          }}
        />
        <span aria-hidden="true" className={styles.inputCheckbox_box} />
        <span className={styles.inputCheckbox_text}>{label}</span>
      </label>

      {helperText && (
        <p id={field.descriptionId} className={styles.inputCheckbox_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={field.errorId} errors={field.errors} />
    </div>
  )
}
