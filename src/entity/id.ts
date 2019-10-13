import { createRehydratorFactory } from './rehydrate'

export interface Id<T> {
  type: T
  signature: number
}

let nextId = 1

if (sessionStorage && addEventListener) {
  const sessionNextId = sessionStorage.getItem('@@next-entity-id')
  if (sessionNextId !== null) {
    nextId = JSON.parse(sessionNextId)
  }
  addEventListener('unload', () =>
    sessionStorage.setItem('@@next-entity-id', JSON.stringify(nextId)),
  )
}

export function createIdFactory<T extends string>(type: T) {
  return function createId(): Id<T> {
    return {
      type,
      signature: nextId++,
    }
  }
}

export const createIdRehydrator = createRehydratorFactory({
  getSignature: ({ signature }: Id<string>) => signature,
  rehydrate: ({ type }: Id<string>) => ({ type, signature: nextId++ }),
})
