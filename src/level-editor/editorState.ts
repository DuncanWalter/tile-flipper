import { createReducer, arraylike, settable } from '@dwalter/create-reducer'
import { Resolve } from '@dwalter/spider-hook'
import { Dispatch } from '@dwalter/spider-hook/src/types'

export type Location = [number, number]

export interface Tile {
  location: Location
  color: 'white' | 'black'
}

const [reducer, actions] = createReducer(
  'tiles',
  [{ location: [3, 4], color: 'white' }],
  arraylike<Tile>(),
)

export const tilesSelector = reducer

export const addTile = actions.add

const [goatReducer, goatActions] = createReducer(
  'goat',
  [3, 4],
  settable<Location>(),
)

export const goatLocationSelector = goatReducer

export function relocateGoat(newGoat: Location) {
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

  return tiles.forEach((tile, i) => {
    if (flippingTiles.has(tile)) {
      dispatch(
        actions.update(i, {
          ...tile,
          color: tile.color === 'white' ? 'black' : 'white',
        }),
      )
    }
  })
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
