import { Id, createIdRehydrator } from './id'
import { createRehydratorFactory } from './rehydrate'

type TileId = Id<'tile'>

type TileColor = 'white' | 'black'

type TileBehavior =
  | {
      type: 'normal'
      undersideColor: TileColor
      undersideBehavior: 'normal' | 'spiky'
    }
  | { type: 'solid' }
  | {
      type: 'spiky'
      undersideColor: TileColor
      undersideBehavior: 'normal' | 'spiky'
    }
  | { type: 'fragile' }

interface Tile {
  id: TileId
  location: [number, number]

  // tile groups will probably need to be an entity type of their own
  group: TileId[]

  color: TileColor
  behavior: TileBehavior
}

export const createTileRehydrator = createRehydratorFactory(
  {
    getSignature: tile => tile.id.signature,
    rehydrate(tile: Tile, rehydrateId) {
      return {
        ...tile,
        id: rehydrateId(tile.id),
      }
    },
  },
  createIdRehydrator,
)
