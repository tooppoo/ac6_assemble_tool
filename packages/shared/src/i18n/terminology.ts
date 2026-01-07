/**
 * I18n Terminology Map
 *
 * パーツの属性名やスロット名の日本語対応表
 * AI のプロンプトや Web UI で共通利用する
 */

/**
 * スロット名の日本語対応
 */
export const slotNames = {
  rightArmUnit: '右腕武器',
  leftArmUnit: '左腕武器',
  rightBackUnit: '右背中武器',
  leftBackUnit: '左背中武器',
  head: '頭部',
  core: 'コア',
  arms: '腕部',
  legs: '脚部',
  booster: 'ブースター',
  fcs: 'FCS',
  generator: 'ジェネレータ',
  expansion: 'コア拡張',
  'arm-unit': '腕武器',
  'back-unit': '背中武器',
} as const

/**
 * パーツ属性名の日本語対応（共通）
 */
export const commonAttributes = {
  // frame
  ap: 'AP',
  antiKineticDefense: '耐弾防御',
  antiEnergyDefense: '耐EN防御',
  antiExplosiveDefense: '耐爆防御',
  attitudeStability: '姿勢安定性能',

  // general
  weight: '総重量',
  enLoad: 'EN負荷',
  price: '価格',
  category: 'カテゴリ',
  manufacture: 'メーカー',
} as const

/**
 * 腕武器の属性名（arm units）
 */
export const armUnitAttributes = {
  attackType: '属性',
  weaponType: '武器タイプ',
  attackPower: '攻撃力',
  impact: '衝撃力',
  accumulativeImpact: '衝撃残留',

  chargeAttackPower: 'チャージ攻撃力',
  chargeImpact: 'チャージ衝撃力',
  chargeAccumulativeImpact: 'チャージ衝撃残留',

  directHitAdjustment: '直撃補正',
  recoil: '射撃反動',
  idealRange: '性能保証射程',
  effectiveRange: '有効射程',
  rapidFire: '連射性能',
  chargeTime: 'チャージ時間',
  magazineRounds: 'マガジン弾数',
  totalRounds: '総弾数',
  reloadTime: 'リロード時間',
  ammunitionCost: '弾単価',

  chargeHeatBuildup: 'チャージ攻撃時発熱',
  cooling: '冷却性能',
  heatBuildup: '攻撃時発熱',
  blastRadius: '爆発範囲',

  chargeEnLoad: 'チャージEN負荷',
  chargeAmmoConsumption: 'チャージ消費弾数',
  chargeBlastRadius: 'チャージ爆発範囲',
  paInterference: 'PA干渉',

  guidance: '誘導性能',
  homingLockTime: '誘導ロック時間',
  lockCount: '最大ロック数',

  consecutiveHits: '連続攻撃回数',
} as const

/**
 * 背中武器の属性名（back units）
 */
export const backUnitAttributes = {
  damageMitigation: '攻撃軽減',
  impactDampening: '衝撃軽減',
  igDamageMitigation: 'IG攻撃軽減',
  igImpactDampening: 'IG衝撃軽減',
  igDuration: 'IG持続時間',
  deployHeatBuildup: '展開時発熱',
  deployment: '展開範囲',
  idleDamageMitigation: 'アイドリング攻撃軽減',
  idleImpactDampening: 'アイドリング衝撃軽減',
  idleDuration: 'アイドリング持続時間',
} as const

/**
 * 頭部の属性名（head）
 */
export const headAttributes = {
  systemRecovery: 'システム復元性能',
  scanDistance: 'スキャン距離',
  scanEffectDuration: 'スキャン持続時間',
  scanStandbyTime: 'スキャン待機時間',
} as const

/**
 * コアの属性名（core）
 */
export const coreAttributes = {
  boosterEfficiencyAdjective: 'ブースター効率補正',
  generatorOutputAdjective: 'ジェネレータ出力補正',
  generatorSupplyAdjective: 'ジェネレータ供給補正',
} as const

/**
 * 腕部の属性名（arms）
 */
export const armsAttributes = {
  armsLoadLimit: '腕部積載上限',
  recoilControl: '反動制御',
  firearmSpecialization: '射撃武器適正',
  meleeSpecialization: '近接武器適正',
} as const

/**
 * 脚部の属性名（legs）
 */
export const legsAttributes = {
  loadLimit: '積載上限',
  jumpDistance: '水平跳躍性能',
  jumpHeight: '垂直跳躍性能',
  // tank
  travelSpeed: '走行性能',
  highSpeedPerformance: '高速走行性能',
} as const

/**
 * FCS の属性名
 */
export const fcsAttributes = {
  closeRangeAssist: '近距離アシスト適正',
  mediumRangeAssist: '中距離アシスト適正',
  longRangeAssist: '遠距離アシスト適正',
  missileLockCorrection: 'ミサイルロック補正',
  multiLockCorrection: 'マルチロック補正',
} as const

/**
 * ブースターの属性名
 */
export const boosterAttributes = {
  thrust: '推力',
  upwardThrust: '上昇推力',
  upwardEnConsumption: '上昇消費EN',
  qbThrust: 'QB推力',
  qbJetDuration: 'QB噴射時間',
  qbEnConsumption: 'QB消費EN',
  qbReloadTime: 'QBリロード時間',
  qbReloadIdealWeight: 'QBリロード保証重量',
  abThrust: 'AB推力',
  abEnConsumption: 'AB消費EN',
  meleeAttackThrust: '近接攻撃推力',
  meleeAttackEnConsumption: '近接攻撃消費EN',
} as const

/**
 * ジェネレータの属性名
 */
export const generatorAttributes = {
  enCapacity: 'EN容量',
  enRecharge: 'EN補充性能',
  supplyRecovery: '供給復元性能',
  postRecoveryEnSupply: '復元時補充EN',
  energyFirearmSpec: 'EN射撃武器適正',
  enOutput: 'EN出力',
} as const

/**
 * コア拡張の属性名
 */
export const expansionAttributes = {
  durability: '耐久性能',
  timeLimit: '持続時間',
} as const

/**
 * 総合ステータスの属性名
 */
export const totalStatusAttributes = {
  load: '積載量',
  armsLoad: '腕部積載量',
  meleeRatio: '近接倍率',
  enFirearmSpec: 'EN射撃武器適正',
  enFirearmRatio: 'EN射撃武器倍率',
  enRechargeDelay: 'EN補充遅延',
  enRecoveryDelay: 'EN復元遅延',
  enSurplus: 'EN余剰',
  enSupplyEfficiency: 'EN供給効率',
  coam: '総COAM',
} as const

/**
 * 全属性名の統合マップ
 */
export const allAttributes = {
  ...commonAttributes,
  ...armUnitAttributes,
  ...backUnitAttributes,
  ...headAttributes,
  ...coreAttributes,
  ...armsAttributes,
  ...legsAttributes,
  ...fcsAttributes,
  ...boosterAttributes,
  ...generatorAttributes,
  ...expansionAttributes,
  ...totalStatusAttributes,
} as const
