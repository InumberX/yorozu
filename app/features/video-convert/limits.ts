import { formatFileSize } from '~/utils/file'

// 動画変換の上限。Worker からも読むため、スキーマ（zod）とは分けて置く。

// 1 ファイルの大きさの上限。変換は端末の中で行い、書き出したものはメモリに置くため。
export const MAX_FILE_SIZE = 200 * 1024 * 1024
export const MAX_FILE_SIZE_LABEL = formatFileSize(MAX_FILE_SIZE)

// 長さの上限（秒）。長い動画は変換に時間がかかり、書き出したものもメモリに置くため。
// 長さは読み込んで見本を作るときにわかる。わかったものはスキーマで確かめ、超えていれば変換させない。
// 見本を作れず長さがわからなかったものは、Worker で確かめる。
export const MAX_DURATION_SECONDS = 2 * 60
export const MAX_DURATION_MINUTES = MAX_DURATION_SECONDS / 60

// Worker で長さを確かめるときの余裕（秒）。一覧は <video> の duration、Worker は Mediabunny の computeDuration
// （いちばん遅いトラックの終わり）で測るため、音声が映像より少し長いと、一覧で通った動画が Worker で落ちることがある。
export const DURATION_TOLERANCE_SECONDS = 0.5
