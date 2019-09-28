import React, { ReactNode } from 'react'
import { useSelector, useDispatch } from '@dwalter/spider-hook'
import {
  tilesSelector,
  addTile,
  goatLocationSelector,
  relocateGoat,
  Location,
  Tile as TileObject,
} from './editorState'
import { Dispatch } from '@dwalter/spider-hook/src/types'

//

let dispatch: Dispatch = () => undefined
let goatLocation: Location

window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'w':
      dispatch(relocateGoat([goatLocation[0], goatLocation[1] - 1]))
      return

    case 'a':
      dispatch(relocateGoat([goatLocation[0] - 1, goatLocation[1]]))
      return

    case 's':
      dispatch(relocateGoat([goatLocation[0], goatLocation[1] + 1]))
      return

    case 'd':
      dispatch(relocateGoat([goatLocation[0] + 1, goatLocation[1]]))
      return
  }
})

export function LevelEditorPage() {
  const tiles = useSelector(tilesSelector)
  goatLocation = useSelector(goatLocationSelector)
  dispatch = useDispatch()

  return (
    <div
      onClick={event => {
        const x = Math.round(event.pageX / 100)
        const y = Math.round(event.pageY / 100)

        dispatch(addTile({ location: [x, y], color: 'black' }))
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <div>Currently placing tile color: White</div>
      <div>
        {tiles.map((tile, i) => (
          <Tile key={i} tile={tile} />
        ))}
      </div>
      <Goat location={goatLocation} />
    </div>
  )
}

function RenderAnchor({
  location: [x, y],
  children,
}: {
  location: [number, number]
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        left: `${100 * x}px`,
        top: `${100 * y}px`,
      }}
    >
      {children}
    </div>
  )
}

function Goat({ location }: { location: Location }) {
  return (
    <RenderAnchor location={location}>
      <div
        style={{
          transform: 'translate(-50%, -50%)',
          width: '65px',
          height: '65px',
          backgroundColor: '#ff0000',
          borderRadius: '32.5px',
        }}
      />
    </RenderAnchor>
  )
}

function Tile({ tile }: { tile: TileObject }) {
  return (
    <RenderAnchor location={tile.location}>
      <div
        style={{
          transform: 'translate(-50%, -50%)',
          backgroundColor: tile.color === 'white' ? '#00ff00' : '#000000',
          width: '100px',
          height: '100px',
        }}
      />
    </RenderAnchor>
  )
}
