export function roundUpByRealPart(posFromLeft: number): (x: number) => number {
  if (posFromLeft < 1) return roundUpByRealPart(1)

  return (x) => {
    const strAbsX = `${Math.abs(x)}`
    if (strAbsX.length < posFromLeft)
      return roundUpByRealPart(strAbsX.length)(x)

    const allRestDigitsAreZero = (() => {
      const rest = strAbsX.slice(posFromLeft)

      return rest.split('').every((v) => v === '0')
    })()
    if (allRestDigitsAreZero) return x

    const index = strAbsX.length - posFromLeft
    const floated = x * Math.pow(0.1, index)

    return Math.ceil(floated) * Math.pow(10, index)
  }
}
