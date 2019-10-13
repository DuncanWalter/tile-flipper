import { createReducer, entityTable } from '@dwalter/create-reducer'
import { Tile, TileId, tileActions, tilesReducer, vec2, Vec2 } from '../entity'
import { Dispatch, Peek } from '@dwalter/spider-hook/src/types'

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

function propagateFlips(dispatch: Dispatch, peek: Peek) {
  const tiles = peek(tilesReducer)
  const lockedTiles = peek(lockedTilesReducer)
  const flippingTiles = Object.keys(peek(flippingTilesReducer)).map(
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
  return async function flipTileAction(dispatch: Dispatch, peek: Peek) {
    const alreadyFlipping = !!Object.keys(peek(flippingTilesReducer)).length

    if (alreadyFlipping) throw new Error('I refuse to flip because reasons')

    dispatch([
      flippingTilesActions.add(tile.id),
      lockedTilesActions.add(tile.id),
    ])

    while (Object.keys(peek(flippingTilesReducer)).length) {
      dispatch(propagateFlips)

      await sleep(200)
    }

    dispatch(lockedTilesActions.clear())
  }
}
