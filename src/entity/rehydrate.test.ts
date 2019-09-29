import { createIdFactory, createIdRehydrator } from './id'

const id = createIdFactory('test')

describe('id rehydration', () => {
  const a = id()
  const b = id()

  const dryIds = JSON.parse(JSON.stringify([a, a, b]))

  it('restores reference equality', () => {
    expect(dryIds[0]).not.toBe(dryIds[1])

    const rehydrate = createIdRehydrator()

    const rehydratedIds = dryIds.map(rehydrate)

    expect(rehydratedIds[0]).toBe(rehydratedIds[1])
  })

  it('preserves reference inequality', () => {
    const rehydrate = createIdRehydrator()

    const rehydratedIds = dryIds.map(rehydrate)

    expect(rehydratedIds[0]).not.toEqual(rehydratedIds[2])
  })

  it('does not preserve signature', () => {
    const rehydrate = createIdRehydrator()

    const rehydratedIds = dryIds.map(rehydrate)

    expect(rehydratedIds[0].signature).not.toEqual(a.signature)
  })
})
