// パーツカテゴリ
export type Category = string

// ARM UNIT
//// 近接
export const pile_bunker = 'pile_bunker' as const
export const explosive_thrower = 'explosive_thrower' as const
export const chainsaw = 'chainsaw' as const
export const stun_baton = 'stun_baton' as const
export const laser_dagger = 'laser_dagger' as const
export const laser_blade = 'laser_blade' as const
export const laser_slicer = 'laser_slicer' as const
export const laser_lance = 'laser_lance' as const
export const plasma_thrower = 'plasma_thrower' as const
export const pulse_blade = 'pulse_blade' as const
export const light_wave_blade = 'light_wave_blade' as const
export const coral_oscillator = 'coral_oscillator' as const

//// 射撃武器
export const burst_rifle = 'burst_rifle' as const
export const linear_rifle = 'linear_rifle' as const
export const assault_rifle = 'assault_rifle' as const
export const burst_assault_rifle = 'burst_assault_rifle' as const
export const machine_gun = 'machine_gun' as const
export const heavy_machine_gun = 'heavy_machine_gun' as const
export const burst_machine_gun = 'burst_machine_gun' as const
export const gatling_gun = 'gatling_gun' as const
export const shotgun = 'shotgun' as const
export const handgun = 'handgun' as const
export const burst_handgun = 'burst_handgun' as const
export const needle_gun = 'needle_gun' as const
export const stun_gun = 'stun_gun' as const
export const bazooka = 'bazooka' as const
export const detonating_bazooka = 'detonating_bazooka' as const
export const grenade = 'grenade' as const
export const napalm_bomb_launcher = 'napalm_bomb_launcher' as const
export const jamming_bomb_launcher = 'jamming_bomb_launcher' as const
export const stun_bomb_launcher = 'stun_bomb_launcher' as const
export const flamethrower = 'flamethrower' as const
export const laser_rifle = 'laser_rifle' as const
export const laser_shotgun = 'laser_shotgun' as const
export const laser_handgun = 'laser_handgun' as const
export const plasma_rifle = 'plasma_rifle' as const
export const coral_rifle = 'coral_rifle' as const
export const multi_energy_rifle = 'multi_energy_rifle' as const
export const pulse_gun = 'pulse_gun' as const
export const hand_missile = 'hand_missile' as const
export const split_hand_missile = 'split_hand_missile' as const
export const siege_hand_missile = 'siege_hand_missile' as const
export const pulse_hand_missile = 'pulse_hand_missile' as const

// BACK UNIT
//// シールド
export const pulse_shield = 'pulse_shield' as const
export const pulse_buckler = 'pulse_buckler' as const
export const pulse_scutum = 'pulse_scutum' as const
export const coral_shield = 'coral_shield' as const

//// キャノン・ランチャー
export const gatling_cannon = 'gatling_cannon' as const
export const spread_bazooka = 'spread_bazooka' as const
export const grenade_cannon = 'grenade_cannon' as const
export const stun_needle_launcher = 'stun_needle_launcher' as const
export const laser_canon = 'laser_canon' as const
export const diffuse_laser_canon = 'diffuse_laser_canon' as const
export const plasma_canon = 'plasma_canon' as const
export const pulse_canon = 'pulse_canon' as const
export const pulse_shield_launcher = 'pulse_shield_launcher' as const
export const light_wave_cannon = 'light_wave_cannon' as const

//// ミサイル
export const missile = 'missile' as const
export const split_missile = 'split_missile' as const
export const dual_missile = 'dual_missile' as const
export const vertical_missile = 'vertical_missile' as const
export const active_homing_missile = 'active_homing_missile' as const
export const container_missile = 'container_missile' as const
export const cluster_missile = 'cluster_missile' as const
export const scatter_missile = 'scatter_missile' as const
export const detonating_missile = 'detonating_missile' as const
export const needle_missile = 'needle_missile' as const
export const plasma_missile = 'plasma_missile' as const
export const coral_missile = 'coral_missile' as const

//// オービット・タレット・ドローン
export const bullet_orbit = 'bullet_orbit' as const
export const laser_orbit = 'laser_orbit' as const
export const laser_turret = 'laser_turret' as const
export const laser_drone = 'laser_drone' as const

// FRAME
export type Frame = typeof head | typeof arms | typeof core | Legs

export const head = 'head' as const
export const arms = 'arms' as const
export const core = 'core' as const

export type Legs = TwoLegs | ReverseJoint | FourLegs | Tank
export const two_legs = 'two_legs' as const
export type TwoLegs = typeof two_legs
export const reverse_joint = 'reverse_joint' as const
export type ReverseJoint = typeof reverse_joint
export const four_legs = 'four_legs' as const
export type FourLegs = typeof four_legs
export const tank = 'tank' as const
export type Tank = typeof tank

// INNER
export const booster = 'booster' as const
export type Booster = typeof booster

export const fcs = 'fcs' as const
export type FCS = typeof fcs

export const generator = 'generator' as const
export type Generator = typeof generator

export const expansion = 'expansion' as const
export type Expansion = typeof expansion

export const notEquipped = 'not-equipped' as const
export type NotEquipped = typeof notEquipped
