/* eslint-disable no-console */

import path from 'path'
import chalk from 'chalk'
import Api from './api.js'
import inquirer from 'inquirer'
import { createDirectory, createFile, isDirectoryExists, readDirectory, readFile, removeDirectory } from './files.js'

export const run = async (command, args, paths) => {
  /**
   *
   * Pull
   *
   */
  if (command === 'pull') {
    // Get all custom types from Prismic API
    const prismicCustomTypes = await Api.getAll({ getDisabled: args.includeDisabled })

    // Ask which one user want to save
    const customTypesChoiceIds = (await inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select custom types',
          name: 'customTypes',
          loop: false,
          choices: prismicCustomTypes.map(customType => {
            return {
              name: `${customType.label} (${customType.id})`,
              value: customType.id,
              checked: true
            }
          })
        }
      ])).customTypes

    console.log()

    // Ensure backup directory exists and remove all json files in it
    await createDirectory(paths.backupDirectory)
    await removeDirectory(path.resolve(paths.backupDirectory, '/*.json'))

    const promises = prismicCustomTypes
      // Keep only custom types checked by user
      .filter(customType => customTypesChoiceIds.includes(customType.id))
      .map(async customType => {
        // Create filename and path
        const fileName = `${customType.id}.json`
        const fileNamePath = path.resolve(paths.backupDirectory, fileName)

        // Create file with API response
        await createFile(fileNamePath, JSON.stringify(customType, null, 2))

        console.log(chalk.green(`✅  "${customType.label}" custom type saved in : `) + path.relative(paths.root, fileNamePath))
      })

    await Promise.all(promises)

    console.log()
    console.log('✨ All custom types are saved ! ✨')
  }

  /**
   *
   * Push
   *
   */
  if (command === 'push') {
    // Get all custom types from Prismic API
    const prismicCustomTypes = await Api.getAll({ getDisabled: args.includeDisabled })

    // Get all custom types from backup directory
    const backupCustomTypes = await readDirectory(paths.backupDirectory)

    const readFilesPromises = backupCustomTypes
      .map(backupCustomTypeFile => readFile(path.resolve(paths.backupDirectory, backupCustomTypeFile)))

    let files = await Promise.all(readFilesPromises)
    files = files.map(JSON.parse)
    console.log('files:', files)

    // prismicCustomTypes
    //   .forEach(customType => {

    //   })
  }
}
