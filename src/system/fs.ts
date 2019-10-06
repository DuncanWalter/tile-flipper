import { remote } from './remote'

export const fs_unsafe: typeof import('fs') = remote.require('fs')

export const fs = fs_unsafe.promises
