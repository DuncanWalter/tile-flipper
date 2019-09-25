import React from 'react'
import { render } from 'react-dom'
import { Provider } from '@dwalter/spider-hook'
import { createDevMiddleware } from '@dwalter/spider-dev-middleware'

import { App } from './app'

const anchorElement = document.getElementById('anchor')

if (anchorElement) {
  render(
    <Provider
      configureStore={createStore => {
        if (process.env.NODE_ENV === 'development') {
          return createStore(createDevMiddleware())
        } else {
          return createStore()
        }
      }}
    >
      <App />
    </Provider>,
    anchorElement,
  )
} else {
  console.error('No anchor element provided')
}
