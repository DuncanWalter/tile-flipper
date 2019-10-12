import { createReducer, settable } from '@dwalter/create-reducer'
import { Resolve, createSelector, tuple } from '@dwalter/spider-hook'
import { Dispatch } from '@dwalter/spider-hook/src/types'
import { Vec2, tilesSelector } from '../entity'

const [goatReducer, goatActions] = createReducer(
  'goat',
  [3, 4],
  settable<Vec2>(),
)

export const goatLocationSelector = goatReducer

export const tileUnderGoat = createSelector(
  tuple(goatReducer, tilesSelector),
  (goat, tiles) =>
    tiles.find(
      tile => tile.location[0] === goat[0] && tile.location[1] === goat[1],
    ),
)

export function relocateGoat(newGoat: Vec2) {
  return (dispatch: Dispatch, resolve: Resolve) => {
    const onTile = resolve(tileUnderGoat)
    const tiles = resolve(tilesSelector)

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
