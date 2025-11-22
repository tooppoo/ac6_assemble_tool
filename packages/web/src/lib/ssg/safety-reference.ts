/**
 * SSGでアプリケーションをビルドする場合、 `location` などブラウザ上でしか参照できないオブジェクトは `onMount` でラップする必要がある。
 * `onMount` でラップしていない場合、ビルド中に `location` などを参照しようとしてエラーとなり、ビルドが失敗する。
 *
 * このファイルには、こうしたSSGに伴い利用方法に注意が必要なオブジェクトを安全に利用するための関数群を定義する.
 */

type F = () => void
type UseAsWitchEnableResult = Readonly<{
  run: F
  enable: F
  isEnabled: () => boolean
}>
export function useWithEnableState(f: () => void): UseAsWitchEnableResult {
  let enable: boolean = false

  return {
    run: () => {
      if (enable) {
        f()
      }
    },
    enable: () => {
      enable = true
    },
    isEnabled: () => enable,
  }
}
