export function sum(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0)
}

export function random<T>(
  xs: readonly T[],
  rand: () => number = () => Math.random(),
): T {
  if (xs.length === 0) throw new Error('random() cannot accept empty array')

  return xs[Math.floor(rand() * xs.length)]
}
