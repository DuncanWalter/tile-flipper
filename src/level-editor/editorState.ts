import { createReducer, arraylike, settable } from '@dwalter/create-reducer'

export type Location = [number, number]

export interface Tile {
  location: Location
  color: 'white' | 'black'
}

const [reducer, actions] = createReducer(
  'tiles',
  [{ location: [0, 0], color: 'white' }],
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

export const relocateGoat = goatActions.set
