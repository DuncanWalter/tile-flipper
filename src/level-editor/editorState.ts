import { createReducer, settable } from '@dwalter/create-reducer'
import { Resolve } from '@dwalter/spider-hook'
import { Dispatch } from '@dwalter/spider-hook/src/types'
import { Vec2, Tile, tilesSelector, tileActions } from '../entity'

const [goatReducer, goatActions] = createReducer(
  'goat',
  [3, 4],
  settable<Vec2>(),
)

export const goatLocationSelector = goatReducer

export function relocateGoat(newGoat: Vec2) {
  return (dispatch: Dispatch, resolve: Resolve) => {
    const goat = resolve(goatReducer)
    const tiles = resolve(tilesSelector)
    const onTile = tiles.find(
      tile => tile.location[0] === goat[0] && tile.location[1] === goat[1],
    )

    if (onTile === undefined) throw 'Hey! Get back to the level!'

    const destinationTile = tiles.find(
      tile =>
        tile.location[0] === newGoat[0] && tile.location[1] === newGoat[1],
    )

    if (destinationTile === undefined) return

    if (destinationTile.color !== onTile.color) return

    dispatch(goatActions.set(newGoat))
  }
}

function getNeighborsOf(allTiles: Tile[], tile: Tile) {
  const [x, y] = tile.location

  return allTiles.filter(
    otherTile =>
      otherTile !== tile &&
      Math.abs(otherTile.location[0] - x) +
        Math.abs(otherTile.location[1] - y) ===
        1,
  )
}

function notUndefined<T>(t: T | undefined): t is T {
  return t !== undefined
}

export function flipTile(dispatch: Dispatch, resolve: Resolve) {
  const goat = resolve(goatReducer)
  const tiles = resolve(tilesSelector)
  const onTile = tiles.find(
    tile => tile.location[0] === goat[0] && tile.location[1] === goat[1],
  )

  if (onTile === undefined) throw 'Hey! Get back to the level!'

  const flippingTiles = new Set([onTile])

  // TODO there are better ways that lazy depth first recursion
  getNeighborsOf(tiles, onTile).forEach(function foo(tile) {
    if (tile.color === onTile.color && !flippingTiles.has(tile)) {
      flippingTiles.add(tile)
      getNeighborsOf(tiles, tile).forEach(foo)
    }
  })

  dispatch(
    tiles
      .map(tile => {
        if (flippingTiles.has(tile)) {
          return tileActions.update({
            ...tile,
            color: tile.color === 'white' ? 'black' : 'white',
          })
        }
      })
      .filter(notUndefined),
  )
}

const [placingColorReducer, placingColorActions] = createReducer(
  'placingColor',
  'white',
  settable<'white' | 'black'>(),
)

export const currentlyPlacingColorSelector = placingColorReducer

export function cyclePlacingColor(dispatch: Dispatch, resolve: Resolve) {
  const placingColor = resolve(currentlyPlacingColorSelector)

  switch (placingColor) {
    case 'white':
      return dispatch(placingColorActions.set('black'))
    case 'black':
      return dispatch(placingColorActions.set('white'))
  }
}
