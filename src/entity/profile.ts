import { createIdFactory, Id, createIdRehydrator } from './id'
import { createRehydratorFactory } from './rehydrate'
import { Options } from '../options'

type ProfileId = Id<'profile'>

export interface Profile {
  id: ProfileId
  options: Partial<Options>
  name: null | string
  signature: string
}

const createProfileId = createIdFactory('profile')

export function createNewProfile(name?: string): Profile {
  const id = createProfileId()

  return {
    id,
    signature: `profile-${id.signature}`,
    name: name || null,
    options: {},
  }
}

export const createProfileRehydrator = createRehydratorFactory(
  {
    getSignature: profile => profile.signature,
    rehydrate(profile: Profile, rehydrateId) {
      return {
        ...createProfileId,
        id: rehydrateId(profile.id),
      }
    },
  },
  createIdRehydrator,
)
