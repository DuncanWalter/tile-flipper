import { createReducer, settable } from '@dwalter/create-reducer'
import { Peek, createSelector } from '@dwalter/spider-hook'
import { Dispatch } from '@dwalter/spider-hook/src/types'
import { Vec2, tilesSelector } from '../entity'

const [goatReducer, goatActions] = createReducer(
  'goat',
  [3, 4],
  settable<Vec2>(),
)

export const goatLocationSelector = goatReducer

export const tileUnderGoat = createSelector(
  (goat, tiles) =>
    tiles.find(
      tile => tile.location[0] === goat[0] && tile.location[1] === goat[1],
    ),
  goatReducer,
  tilesSelector,
)

export function relocateGoat(newGoat: Vec2) {
  return (dispatch: Dispatch, peek: Peek) => {
    const onTile = peek(tileUnderGoat)
    const tiles = peek(tilesSelector)

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

export function cyclePlacingColor(dispatch: Dispatch, peek: Peek) {
  const placingColor = peek(currentlyPlacingColorSelector)

  switch (placingColor) {
    case 'white':
      return dispatch(placingColorActions.set('black'))
    case 'black':
      return dispatch(placingColorActions.set('white'))
  }
}
