import { createSelector } from '@dwalter/spider-hook'
import { createReducer, entityTable } from '@dwalter/create-reducer'

import { Id, createIdRehydrator, createIdFactory } from './id'
import { createRehydratorFactory } from './rehydrate'
import { Vec2 } from './vec2'

export type TileId = Id<'tile'>

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

export interface Tile {
  id: TileId
  location: Vec2

  // tile groups will probably need to be an entity type of their own
  group: TileId[]

  color: TileColor
  behavior: TileBehavior
}

type TilesState = Record<
  string | number,
  {
    lock: number
    entity: Tile
  }
>

export const createTileId = createIdFactory('tile')

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

const [reducer, actions] = createReducer(
  'tiles',
  {},
  {
    ...entityTable<Tile>(tile => tile.id.signature),
    bulkReplace(state: TilesState, tiles: Iterable<Tile>) {
      const newState = {} as typeof state
      for (const tile of tiles) {
        newState[tile.id.signature] = {
          lock: 1,
          entity: tile,
        }
      }
      return newState
    },
  },
)

export const tilesReducer = reducer

export const tilesSelector = createSelector(
  tiles => Object.keys(tiles).map(key => tiles[key]!.entity),
  reducer,
)

export const tileActions = actions
