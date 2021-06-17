#!/usr/bin/env node

import path from 'path'
import dotenv from 'dotenv'

import meow from 'meow'
import chalk from 'chalk'

import { run } from '../src/index.js'
import Api from '../src/api.js'
dotenv.config()

const BIN_NAME = 'prismic-ct-versionning'
const DEFAULT_ARGS = {
  output: 'custom-types'
}

const cliExecution = meow(`

    ${chalk.bold('Usage')}
      $ ${chalk.cyan(BIN_NAME)} ${chalk.magenta('[command]')}

    ${chalk.bold('Commands')}
      ${chalk.magenta('backup')} -

    ${chalk.bold('Examples')}
      $ ${chalk.cyan(BIN_NAME)} ${chalk.magenta('backup')}                                  Display a checkbox list of all tasks
`, {
  flags: {
    output: {
      type: 'string',
      alias: 'o'
    }
  }
})

// Show help if -h flag is present
if (cliExecution.flags.h) {
  cliExecution.showHelp()
}

// Show version if -v flag is present
if (cliExecution.flags.v) {
  cliExecution.showVersion()
}

// Check command
const command = cliExecution.input[0]
if (!['backup'].includes(command)) {
  cliExecution.showHelp()
}

(async _ => {
  const args = {
    ...DEFAULT_ARGS,
    ...cliExecution.flags
  }

  const paths = {
    root: path.resolve(process.cwd()),
    backupDirectory: path.resolve(process.cwd(), args.output)
  }

  Api.createClient({
    token: process.env.PRISMIC_TOKEN,
    repository: process.env.PRISMIC_REPOSITORY
  })

  await run(command, args, paths)
})()
