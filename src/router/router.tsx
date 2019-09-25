import React from 'react'
import { useSelector } from '@dwalter/spider-hook'

import { MainMenuPage } from '../main-menu'
import { OptionsPage } from '../options'

import { getUriPath } from './uriState'

export function Router() {
  const uriPath = useSelector(getUriPath)

  switch (uriPath) {
    case 'options':
      return <OptionsPage />

    default:
      return <MainMenuPage />
  }
}
