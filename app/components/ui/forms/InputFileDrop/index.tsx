import { type getInputProps } from '@conform-to/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { FormErrorMessage } from '~/components/ui/forms/FormErrorMessage'
import { isAcceptedFile, mergeFiles, setInputFiles } from '~/utils/file'
import { getDescriptionId, getErrorId, joinIds } from '~/utils/form'

export type InputFileDropProps = {
  // `getInputProps(fields.x, { type: 'file' })` の戻り値
  inputProps: ReturnType<typeof getInputProps>
  // 読み込んだファイルの一覧。呼び出し元が持ち、変わったら onChangeFiles で受け取る。
  files: File[]
  onChangeFiles: (files: File[]) => void
  // 読み込めるファイルの種類（input の accept と同じ書き方）
  accept: string
  errors?: string[]
  helperText?: ReactNode
  isDisabled?: boolean
  className?: string
  // ファイルを読み込んだあとに、追加ボタンの上へ並べるもの（読み込んだファイルの一覧など）
  children?: ReactNode
}

// ファイルを複数読み込む入力。ドロップと「ファイルを選択」の両方で読み込める。
// - ファイルがないときは、大きなドロップ欄を出す。
// - ファイルがあるときは、children（一覧）と「ファイルを追加する」を出す。こちらにもドロップできる。
//
// 読み込んだファイルは、本物の input[type="file"] にも書き戻す。
// Conform の検証と、フォームを送るときの FormData が、この input を読むため。
export const InputFileDrop = ({
  inputProps,
  files,
  onChangeFiles,
  accept,
  errors,
  helperText,
  isDisabled,
  className,
  children,
}: InputFileDropProps) => {
  const { t } = useTranslation('common')
  const { key, ...props } = inputProps
  const id = props.id ?? ''
  const inputRef = useRef<HTMLInputElement>(null)
  // input に書き戻したことを知らせるイベントを、自分の変更として扱わないための目印
  const isSyncingRef = useRef(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [rejectedNames, setRejectedNames] = useState<string[]>([])

  const hasFiles = files.length > 0
  const hasErrors = !!errors?.length || rejectedNames.length > 0
  const displayErrors = [
    ...(errors ?? []),
    ...(rejectedNames.length > 0 ? [t('form.inputFileDrop.rejected', { names: rejectedNames.join(', ') })] : []),
  ]

  // input の中身を一覧にそろえ、Conform に検証し直させる。
  const syncInput = (next: File[]) => {
    const input = inputRef.current
    if (!input) {
      return
    }

    const current = Array.from(input.files ?? [])
    const isSame = current.length === next.length && current.every((file, i) => file === next[i])
    if (isSame || !setInputFiles(input, next)) {
      return
    }

    isSyncingRef.current = true
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    isSyncingRef.current = false
  }

  // 呼び出し元が一覧を変えたとき（削除・リセット）も、input をそろえる。
  useEffect(() => {
    syncInput(files)
    // syncInput は files しか読まない
  }, [files])

  // 読み込んだファイルを一覧に足し、足したあとの一覧を返す。
  const addFiles = (fileList: FileList | null): File[] => {
    const added = Array.from(fileList ?? [])
    if (added.length === 0) {
      return files
    }

    const accepted = added.filter((file) => isAcceptedFile(file, accept))
    setRejectedNames(added.filter((file) => !accepted.includes(file)).map((file) => file.name))

    const next = mergeFiles(files, accepted)
    if (next.length !== files.length) {
      onChangeFiles(next)
    }
    return next
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (isDisabled) {
      event.dataTransfer.dropEffect = 'none'
      return
    }
    event.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    // 中の要素へ移っただけのときは、ドラッグ中の表示を消さない
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    if (isDisabled) {
      return
    }
    addFiles(event.dataTransfer.files)
  }

  const describedBy = joinIds(hasErrors && getErrorId(id), !!helperText && getDescriptionId(id))

  return (
    <div className={[styles.inputFileDrop, className].filter(Boolean).join(' ')}>
      <input
        key={key}
        {...props}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className={styles.inputFileDrop_input}
        // 操作は見えているボタンで受ける。input はフォームの値を持つためだけに置く。
        tabIndex={-1}
        aria-hidden="true"
        aria-invalid={hasErrors || undefined}
        aria-describedby={describedBy}
        disabled={isDisabled}
        onChange={(event) => {
          if (isSyncingRef.current) {
            return
          }
          // ダイアログで選んだファイルは、いったん input の中身を置き換えてしまう。
          // 一覧に足したうえで、input の中身を一覧全体に戻す。
          syncInput(addFiles(event.currentTarget.files))
        }}
      />

      <div
        className={[
          styles.inputFileDrop_area,
          hasFiles ? styles.inputFileDrop_area__filled : styles.inputFileDrop_area__empty,
          isDragOver && styles.inputFileDrop_area__dragOver,
          isDisabled && styles.inputFileDrop_area__disabled,
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasFiles ? (
          <>
            {children}
            <button
              type="button"
              className={styles.inputFileDrop_addButton}
              aria-describedby={describedBy}
              disabled={isDisabled}
              onClick={openFileDialog}
            >
              <span aria-hidden="true" className={styles.inputFileDrop_addIcon}>
                +
              </span>
              {t('form.inputFileDrop.add')}
            </button>
          </>
        ) : (
          <div className={styles.inputFileDrop_empty}>
            <svg
              aria-hidden="true"
              className={styles.inputFileDrop_icon}
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 27 V8 M12 16 L20 8 L28 16 M6 26 V33 H34 V26" />
            </svg>
            <span className={styles.inputFileDrop_dropTitle}>{t('form.inputFileDrop.dropTitle')}</span>
            <span className={styles.inputFileDrop_dropOr}>{t('form.inputFileDrop.dropOr')}</span>
            <button
              type="button"
              className={styles.inputFileDrop_pickButton}
              aria-describedby={describedBy}
              disabled={isDisabled}
              onClick={openFileDialog}
            >
              {t('form.inputFileDrop.pick')}
            </button>
          </div>
        )}
      </div>

      {helperText && (
        <p id={getDescriptionId(id)} className={styles.inputFileDrop_helperText}>
          {helperText}
        </p>
      )}

      <FormErrorMessage id={getErrorId(id)} errors={displayErrors} />
    </div>
  )
}
