import React from 'react'
import { useSelector } from '@dwalter/spider-hook'

import { MainMenuPage } from '../main-menu'
import { OptionsPage } from '../options'

import { getUriPath } from './uriState'
import { LevelEditorPage } from '../level-editor'

export function Router() {
  const uriPath = useSelector(getUriPath)

  switch (uriPath) {
    case 'level-editor':
      return <LevelEditorPage />

    case 'options':
      return <OptionsPage />

    default:
      return <MainMenuPage />
  }
}
