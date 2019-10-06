export interface Options {
  windowMode: 'windowed' | 'fullscreen-windowed' | 'fullscreen'
  colorblind: boolean
  // control schemes
  // ui QOL options
  // etc
}

export type OptionsOverride = Partial<Options>

export function defaultOptions(): Options {
  return {
    windowMode: 'fullscreen-windowed',
    colorblind: false,
  }
}

export function applyOptionsOverrides(
  base: Options,
  ...overrides: OptionsOverride[]
): Options {
  return Object.assign({}, base, ...overrides)
}
