/* eslint-disable no-console */
import pull from './commands/pull.js'
import push from './commands/push.js'

export const run = async (command, args, paths) => {
  // Pull
  if (command === 'pull') {
    return await pull(args, paths)
  }

  // Push
  if (command === 'push') {
    return await push(args, paths)
  }
}
