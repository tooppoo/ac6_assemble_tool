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
}>

export type WithEnLoad = Readonly<{
  /** EN負荷 */
  en_load: number
}>
