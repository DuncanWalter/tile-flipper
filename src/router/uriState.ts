import { createSelector } from '@dwalter/spider-hook'
import { createReducer, settable } from '@dwalter/create-reducer'

const uri = /^([-/\w\d]+)(\?.*)?$/
const uriParameters = /^[^?]*(\?\{.*\})$/

const [reducer, actions] = createReducer('router', '', settable<string>())

export function navigateToUri(newUri: string) {
  if (uri.exec(newUri) !== null) {
    return actions.set(newUri)
  } else {
    console.error(new Error(`Error: Malformed uri ${newUri}`))
    return []
  }
}

export const getUriPath = createSelector(
  [reducer],
  rawUri => {
    const match = uri.exec(rawUri)

    if (match === null) {
      return ''
    }

    return match[1]
  },
)

export const getUriParameters = createSelector(
  [reducer],
  rawUri => {
    const match = uriParameters.exec(rawUri)

    if (match === null) {
      return null
    }

    try {
      return JSON.parse(match[1]) as object
    } catch (error) {
      console.error(error)
      return null
    }
  },
)
