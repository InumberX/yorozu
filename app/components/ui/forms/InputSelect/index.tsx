import { type getSelectProps } from '@conform-to/react'
import { type ReactNode } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'
import { getDescriptionId, getErrorId, joinIds } from '~/utils/form'

export type InputSelectOption = {
  value: string
  label: string
}

export type InputSelectProps = {
  // `getSelectProps(fields.x)` の戻り値
  selectProps: ReturnType<typeof getSelectProps>
  label: ReactNode
  options: InputSelectOption[]
  errors?: string[]
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

// 一覧から 1 つを選ぶ。ブラウザのセレクトボックスを使い、見た目だけをそろえる。
export const InputSelect = ({
  selectProps,
  label,
  options,
  errors,
  helperText,
  isDisabled,
  className,
  onChange,
}: InputSelectProps) => {
  const { key, ...props } = selectProps
  const id = props.id ?? ''
  const hasErrors = !!errors?.length

  return (
    <div className={[styles.inputSelect, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.inputSelect_label}>
        {label}
      </label>

      <span className={styles.inputSelect_field}>
        <select
          key={key}
          {...props}
          className={styles.inputSelect_select}
          aria-invalid={hasErrors || undefined}
          aria-describedby={joinIds(hasErrors && getErrorId(id), !!helperText && getDescriptionId(id))}
          disabled={isDisabled}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className={styles.inputSelect_arrow}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 4 L6 8 L10 4" />
        </svg>
      </span>

      {helperText && (
        <p id={getDescriptionId(id)} className={styles.inputSelect_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={getErrorId(id)} errors={errors} />
    </div>
  )
}
