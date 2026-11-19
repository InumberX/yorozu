import * as styles from './style.css'

export type FormErrorMessageProps = {
  // 入力の aria-describedby から指す ID。Conform の `field.errorId` を渡す。
  id: string
  errors?: string[]
  className?: string
}

// 入力の下に出すエラーメッセージ。
// エラーがないときも要素は残し、隠さない（aria-describedby の参照先が消えないように、また
// aria-live の領域が最初からあることで、後から入った文言を読み上げさせるため）。
// 中身がないときは高さが 0 になる。エラーとの間の余白は、エラーの一覧の側に付ける。
export const FormErrorMessage = ({ id, errors, className }: FormErrorMessageProps) => {
  const hasErrors = !!errors?.length

  return (
    <div id={id} aria-live="polite" className={[styles.formErrorMessage, className].filter(Boolean).join(' ')}>
      {hasErrors && (
        <ul className={styles.formErrorMessage_items}>
          {errors.map((error, i) => (
            <li key={`${i}-${error}`} className={styles.formErrorMessage_item}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
