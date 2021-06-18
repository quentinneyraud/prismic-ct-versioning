#!/usr/bin/env node

/* eslint-disable no-console */

import path from 'path'
import dotenv from 'dotenv'

import meow from 'meow'
import chalk from 'chalk'

import { run } from '../src/index.js'
import Api from '../src/api.js'
dotenv.config()

const BIN_NAME = 'pctv'

const cliExecution = meow(`

    ${chalk.bold('Usage')}
      $ ${chalk.cyan(BIN_NAME)} ${chalk.magenta('[command]')} ${chalk.yellow('[--include-disabled --id | --output --o | --token --t | --repository --r]')}

    ${chalk.bold('Commands')}
      ${chalk.magenta('pull')} - Display a checkbox list of all custom types and save all checked one

    ${chalk.bold('Options')}
      ${chalk.yellow('include-disabled')} - Also save disabled custom types (Default: false)
      ${chalk.yellow('output')} - Change where custom type files are saved (Default: "custom-types")
      ${chalk.yellow('token')} - Set Prismic token (Default: from PRISMIC_TOKEN key in .env file)
      ${chalk.yellow('repository')} - Set Prismic repository ID (Default: from PRISMIC_REPOSITORY key in .env file)

    ${chalk.bold('Examples')}
      $ ${chalk.cyan(BIN_NAME)} ${chalk.magenta('pull')}
      $ ${chalk.cyan(BIN_NAME)} ${chalk.magenta('pull')} ${chalk.yellow('--include-disabled')}
`, {
  flags: {
    includeDisabled: {
      type: 'boolean',
      alias: 'id'
    },
    output: {
      type: 'string',
      alias: 'o'
    },
    token: {
      type: 'string',
      alias: 't'
    },
    repository: {
      type: 'string',
      alias: 'r'
    }
  }
})

console.log()

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
if (!['pull'].includes(command)) {
  cliExecution.showHelp()
}

const args = {
  outputDirectory: cliExecution.flags.output || 'custom-types',
  prismicToken: cliExecution.flags.token || process.env.PRISMIC_TOKEN,
  prismicRepository: cliExecution.flags.repository || process.env.PRISMIC_REPOSITORY,
  includeDisabled: !!cliExecution.flags.includeDisabled
}

if (!args.prismicToken) {
  console.log(chalk.red('Missing Prismic Custom Type API token'))
  console.log(`Request Custom Types API feature activation ${chalk.blue('https://community.prismic.io/t/feature-activations-graphql-integration-fields-etc/847')}`)
  console.log(`and generate token as explained here ${chalk.blue('https://prismic.io/docs/technologies/custom-types-api#permanent-token-recommended')}`)
  console.log('Then create a .env file with PRISMIC_TOKEN key or use --token flag')
  process.exit(0)
}

if (!args.prismicRepository) {
  console.log(chalk.red('Missing Prismic repositiory ID'))
  console.log(`Request Custom Types API feature activation ${chalk.blue('https://community.prismic.io/t/feature-activations-graphql-integration-fields-etc/847')}`)
  console.log('Then create a .env file with PRISMIC_REPOSITORY key or use --repository flag')
  process.exit(0)
}

const paths = {
  root: path.resolve(process.cwd()),
  backupDirectory: path.resolve(process.cwd(), args.outputDirectory)
}

Api.createClient({
  token: args.prismicToken,
  repository: args.prismicRepository
})

const r = async _ => {
  await run(command, args, paths)
}
r()
