import React from 'react'
import { render } from 'react-dom'
import { SpiderRoot } from '@dwalter/spider-hook'
import { createDevMiddleware } from '@dwalter/spider-dev-middleware'

import { App } from './app'

const anchorElement = document.getElementById('anchor')

if (anchorElement) {
  render(
    <SpiderRoot
      configureStore={createStore => {
        if (process.env.NODE_ENV === 'development') {
          return createStore(createDevMiddleware())
        } else {
          return createStore()
        }
      }}
    >
      <App />
    </SpiderRoot>,
    anchorElement,
  )
} else {
  console.error('No anchor element provided')
}
