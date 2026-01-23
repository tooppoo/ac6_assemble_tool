/**
 * https://github.com/FullHuman/purgecss/issues/1327
 * ドキュメント通りにcommonjsで設定ファイルを書くと動作しない
 * ESMとして定義し、さらに各オプションを個別にexport
 */

export const content = ['dist/**/*.html', 'dist/**/*.js', 'src/**/*.svelte']
export const css = ['dist/_app/immutable/assets/*.css']
export const output = 'dist/_app/immutable/assets/'
export const variables = true
export const fontFace = true
export const keyframes = true
export const safelist = {
  standard: ['spinner-border', 'spinner-border-sm', 'alert', 'alert-warning'],
  keyframes: ['spinner-border'],
}
