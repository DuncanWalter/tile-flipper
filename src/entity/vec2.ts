export type Vec2 = [number, number]

export function add(a: Vec2, b: Vec2, out: Vec2 = [0, 0]): Vec2 {
  out[0] = a[0] + b[0]
  out[1] = a[1] + b[1]

  return out
}

export function dot(a: Vec2, b: Vec2) {
  return a[0] * b[0] + a[1] * b[1]
}

export function magnitude(v: Vec2) {
  if (v[0] === 0) return Math.abs(v[1])
  if (v[1] === 0) return Math.abs(v[0])

  return Math.sqrt(dot(v, v))
}

export function scale(s: number, v: Vec2, out: Vec2 = [0, 0]): Vec2 {
  out[0] = s * v[0]
  out[1] = s * v[1]

  return out
}

export function project(a: Vec2, b: Vec2, out?: Vec2) {
  return scale(dot(a, b) / dot(b, b), b, out)
}

export function subtract(a: Vec2, b: Vec2, out: Vec2 = [0, 0]): Vec2 {
  out[0] = a[0] - b[0]
  out[1] = a[1] - b[1]

  return out
}

export function reject(a: Vec2, b: Vec2, out?: Vec2) {
  return subtract(a, project(a, b), out)
}

export function relative(a: Vec2, b: Vec2, out?: Vec2): Vec2 {
  return subtract(b, a, out)
}

export function sum(vs: Vec2[], out: Vec2 = [0, 0]) {
  for (const v of vs) {
    add(out, v, out)
  }

  return out
}

export function mean(vs: Vec2[]) {
  const s = sum(vs, [0, 0])

  return scale(1 / vs.length, s, s)
}

export function total(v: Vec2) {
  return v[0] + v[1]
}

export function unit(v: Vec2, out?: Vec2) {
  const m = magnitude(v)

  return scale(1 / m, v, out)
}
