import React, { Fragment } from 'react'
import { useDispatch } from '@dwalter/spider-hook'

import { navigateToUri } from '../router'

export function MainMenuPage() {
  const dispatch = useDispatch()

  let devMenus: undefined | JSX.Element

  if (process.env.NODE_ENV) {
    devMenus = (
      <Fragment>
        <li onClick={() => dispatch(navigateToUri('level-editor'))}>
          Edit Levels
        </li>
      </Fragment>
    )
  }

  return (
    <div>
      <h1>Tile Flipper</h1>
      <li>Play</li>
      <li>Choose Profile</li>
      <li onClick={() => dispatch(navigateToUri('options'))}>Options</li>
      {devMenus}
    </div>
  )
}
