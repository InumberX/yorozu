import { type FieldMetadata, getCollectionProps } from '@conform-to/react'
import { type ReactNode } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'

export type InputRadioCardOption<Value extends string = string> = {
  value: Value
  label: ReactNode
  // ラベルの下に添える短い説明
  note?: ReactNode
}

export type InputRadioCardProps<Value extends string = string> = {
  // Conform のフィールド。値は選んだ選択肢の value。
  field: FieldMetadata<Value | undefined>
  // 選択肢のまとまりの名前（fieldset の legend）
  legend: ReactNode
  options: InputRadioCardOption<Value>[]
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: Value) => void
}

// 選択肢から 1 つを選ぶ、カード型のラジオボタン。
// 本物の radio を見えない形で重ね、カードの枠と面は radio の状態から描く。
export const InputRadioCard = <Value extends string = string>({
  field,
  legend,
  options,
  helperText,
  isDisabled,
  className,
  onChange,
}: InputRadioCardProps<Value>) => {
  const collectionProps = getCollectionProps(field, {
    type: 'radio',
    options: options.map((option) => option.value),
    ariaDescribedBy: helperText ? field.descriptionId : undefined,
  })

  return (
    <fieldset
      className={[styles.inputRadioCard, className].filter(Boolean).join(' ')}
      aria-describedby={field.errors?.length ? field.errorId : undefined}
      disabled={isDisabled}
    >
      <legend className={styles.inputRadioCard_legend}>{legend}</legend>

      <div className={styles.inputRadioCard_items}>
        {collectionProps.map(({ key, ...inputProps }, i) => {
          const option = options[i]

          return (
            <label key={key} className={styles.inputRadioCard_item}>
              <input
                {...inputProps}
                className={styles.inputRadioCard_input}
                onChange={(event) => {
                  onChange?.(event, event.currentTarget.value as Value)
                }}
              />
              <span className={styles.inputRadioCard_label}>{option.label}</span>
              {option.note && <span className={styles.inputRadioCard_note}>{option.note}</span>}
            </label>
          )
        })}
      </div>

      {helperText && (
        <p id={field.descriptionId} className={styles.inputRadioCard_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={field.errorId} errors={field.errors} />
    </fieldset>
  )
}
