import { createRehydratorFactory } from './rehydrate'

export interface Id<T> {
  type: T
  signature: number
}

let nextId = 1

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
