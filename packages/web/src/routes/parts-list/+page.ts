/**
 * パーツ一覧ページのデータロード
 *
 * このページでは以下の処理を行います:
 * 1. 最新のregulationデータをロード
 * 2. URLパラメータから初期状態を復元（将来実装）
 */

import { latest as regulation } from '$lib/regulation'

import type { Regulation } from '@ac6_assemble_tool/parts/versions/regulation.types'

/**
 * ページデータ型定義
 */
export type PageData = {
  regulation: Regulation
}

/**
 * ページデータのロード関数
 *
 * @returns PageData - regulation データを含むページデータ
 */
export function load(): PageData {
  return {
    regulation,
  }
}
