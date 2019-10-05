import React, { ReactNode, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from '@dwalter/spider-hook'
import {
  goatLocationSelector,
  relocateGoat,
  currentlyPlacingColorSelector,
  cyclePlacingColor,
  flipTile,
} from './editorState'
import {
  tilesSelector,
  tileActions,
  Vec2,
  Tile as TileObject,
  createTileId,
} from '../entity'
import { utils as SpiderUtils } from '@dwalter/spider-hook'

const useEventListener = ((type: string, handler: Function, options: any) => {
  const handlerRef = useRef(handler)

  handlerRef.current = handler

  const deps = [type, options]

  const shouldUpdate = SpiderUtils.useShouldUpdate(deps)

  useEffect(
    shouldUpdate
      ? () => {
          const artificialHandler = (event: Event) => handlerRef.current(event)

          addEventListener(type, artificialHandler, options)

          return () => removeEventListener(type, artificialHandler, options)
        }
      : (null as any),
    deps,
  )
}) as typeof addEventListener

export function LevelEditorPage() {
  const currentlyPlacingColor = useSelector(currentlyPlacingColorSelector)
  const tiles = useSelector(tilesSelector)
  const goatLocation = useSelector(goatLocationSelector)
  const dispatch = useDispatch()

  useEventListener('keydown', event => {
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

      case 'c':
        dispatch(cyclePlacingColor)
        return

      case ' ':
        dispatch(flipTile)
        return
    }
  })

  return (
    <div
      onClick={event => {
        const x = Math.round(event.pageX / 100)
        const y = Math.round(event.pageY / 100)

        dispatch(
          tileActions.add({
            id: createTileId(),
            location: [x, y],
            group: [
              /*FIXME*/
            ],
            color: currentlyPlacingColor,
            behavior: {
              type: 'normal',
              undersideBehavior: 'normal',
              undersideColor:
                currentlyPlacingColor === 'black' ? 'white' : 'black',
            },
          }),
        )
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <div>{`Currently placing tile [C]olor: ${currentlyPlacingColor}`}</div>
      <div>{`Currently placing tile [T]ype: normal`}</div>

      {tiles.map((tile, i) => (
        <Tile key={i} tile={tile} />
      ))}

      <Goat location={goatLocation} />
    </div>
  )
}

function RenderAnchor({
  location: [x, y],
  children,
}: {
  location: Vec2
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

function Goat({ location }: { location: Vec2 }) {
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
