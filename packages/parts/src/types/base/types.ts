import { type Category } from './category'
import { type Classification } from './classification'
import { type Manufacture } from './manufacture'

export type ACParts<
  Cl extends Classification = Classification,
  M extends Manufacture = Manufacture,
  Ca extends Category = Category,
> = Readonly<{
  /** グローバルユニークID */
  id: string
  /** 名前 */
  name: string
  /** 分類 */
  classification: Cl
  /** 製造企業 */
  manufacture: M
  /** カテゴリ */
  category: Ca
  /** 価格 */
  price: number
  /** 重量 */
  weight: number
  /** EN負荷 */
  en_load: number
  /** AI用の簡潔な説明（2-3文） */
  ai_summary: string
  /** AI用のタグ（検索・分類用） */
  ai_tags: readonly string[]
}>

export type WithEnLoad = Readonly<{
  /** EN負荷 */
  en_load: number
}>
