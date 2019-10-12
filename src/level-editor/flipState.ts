import { createReducer, entityTable } from '@dwalter/create-reducer'
import { Tile, TileId, tileActions, tilesReducer, vec2, Vec2 } from '../entity'
import { Dispatch, Resolve } from '@dwalter/spider-hook/src/types'

const [lockedTilesReducer, lockedTilesActions] = createReducer(
  'locked-tiles',
  {},
  {
    ...entityTable<TileId>(id => id.signature),
    clear() {
      return {}
    },
  },
)

const [flippingTilesReducer, flippingTilesActions] = createReducer(
  'flipping-tiles',
  {},
  entityTable<TileId>(id => id.signature),
)

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  }).catch(console.error)
}

function propagateFlips(dispatch: Dispatch, resolve: Resolve) {
  const tiles = resolve(tilesReducer)
  const lockedTiles = resolve(lockedTilesReducer)
  const flippingTiles = Object.keys(resolve(flippingTilesReducer)).map(
    key => tiles[key].entity,
  )

  const propagationActions = []
  for (const key of Object.keys(tiles)) {
    if (lockedTiles[key]) continue

    const tile = tiles[key].entity

    const out: Vec2 = [0, 0]

    const flippingNeighbor = flippingTiles.find(
      flippingTile =>
        flippingTile.color === tile.color &&
        vec2.magnitude(
          vec2.subtract(flippingTile.location, tile.location, out),
        ) <= 1,
    )

    if (flippingNeighbor) {
      propagationActions.push(
        lockedTilesActions.add(tile.id),
        flippingTilesActions.add(tile.id),
      )
    }
  }

  const flippingActions = flippingTiles.map(tile => [
    tileActions.update({
      ...tile,
      color: tile.color === 'white' ? 'black' : 'white',
    }),
    flippingTilesActions.remove(tile.id),
  ])

  dispatch([propagationActions, flippingActions])
}

export function flipTile(tile: Tile) {
  return async function flipTileAction(dispatch: Dispatch, resolve: Resolve) {
    const alreadyFlipping = !!Object.keys(resolve(flippingTilesReducer)).length

    if (alreadyFlipping) throw new Error('I refuse to flip because reasons')

    dispatch([
      lockedTilesActions.clear(),
      flippingTilesActions.add(tile.id),
      lockedTilesActions.add(tile.id),
    ])

    while (!!Object.keys(resolve(flippingTilesReducer)).length) {
      dispatch(propagateFlips)

      await sleep(200)
    }
  }
}
