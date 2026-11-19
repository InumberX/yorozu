import { type getCollectionProps } from '@conform-to/react'
import { type ReactNode } from 'react'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'
import { getDescriptionId, getErrorId, joinIds } from '~/utils/form'

export type InputRadioCardOption = {
  label: ReactNode
  // ラベルの下に添える短い説明
  note?: ReactNode
}

export type InputRadioCardProps = {
  // フィールドの id（`fields.x.id`）。エラーと説明の ID をここから求める。
  id: string
  // `getCollectionProps(fields.x, { type: 'radio', options })` の戻り値
  inputProps: ReturnType<typeof getCollectionProps>
  // `inputProps` と同じ並びの、各選択肢の表示
  options: InputRadioCardOption[]
  // 選択肢のまとまりの名前（fieldset の legend）
  legend: ReactNode
  errors?: string[]
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}

// 選択肢から 1 つを選ぶ、カード型のラジオボタン。
// 本物の radio を見えない形で重ね、カードの枠と面は radio の状態から描く。
export const InputRadioCard = ({
  id,
  inputProps,
  options,
  legend,
  errors,
  helperText,
  isDisabled,
  className,
  onChange,
}: InputRadioCardProps) => {
  const hasErrors = !!errors?.length
  const describedBy = joinIds(hasErrors && getErrorId(id), !!helperText && getDescriptionId(id))

  return (
    <fieldset
      className={[styles.inputRadioCard, className].filter(Boolean).join(' ')}
      aria-describedby={describedBy}
      disabled={isDisabled}
    >
      <legend className={styles.inputRadioCard_legend}>{legend}</legend>

      <div className={styles.inputRadioCard_items}>
        {inputProps.map(({ key, ...props }, i) => {
          const option = options[i]
          // 添え書きはラジオボタンの名前に混ぜず、説明として読ませる
          const labelId = `${props.id}-label`
          const noteId = option?.note ? `${props.id}-note` : undefined

          return (
            <label key={key} className={styles.inputRadioCard_item}>
              <input
                {...props}
                type="radio"
                className={styles.inputRadioCard_input}
                aria-invalid={hasErrors || undefined}
                aria-labelledby={labelId}
                aria-describedby={noteId}
                onChange={(event) => {
                  onChange?.(event, event.currentTarget.value)
                }}
              />
              <span id={labelId} className={styles.inputRadioCard_label}>
                {option?.label}
              </span>
              {option?.note && (
                <span id={noteId} className={styles.inputRadioCard_note}>
                  {option.note}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {helperText && (
        <p id={getDescriptionId(id)} className={styles.inputRadioCard_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={getErrorId(id)} errors={errors} />
    </fieldset>
  )
}
