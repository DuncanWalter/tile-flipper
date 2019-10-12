import React from 'react'
import { render } from 'react-dom'
import { Provider } from '@dwalter/spider-hook'

import { App } from './app'

const anchorElement = document.getElementById('anchor')

if (anchorElement) {
  render(
    <Provider>
      <App />
    </Provider>,
    anchorElement,
  )
} else {
  console.error('No anchor element provided')
}
