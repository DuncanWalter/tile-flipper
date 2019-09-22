import React from 'react'
import { render } from 'react-dom'
import { SpiderRoot } from '@dwalter/spider-hook'

import { App } from './app'

const anchorElement = document.getElementById('anchor')

if (anchorElement) {
  render(
    <SpiderRoot>
      <App />
    </SpiderRoot>,
    anchorElement,
  )
} else {
  console.error('No anchor element provided')
}
