/* eslint-disable no-console */

import inquirer from 'inquirer'
import path from 'path'
import chalk from 'chalk'
import Api from '../api.js'
import { readFile, readDirectory } from '../files.js'

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default async (args, paths) => {
  // Get all custom types from Prismic API
  const prismicCustomTypes = await Api.getAll()

  // Get all custom types from backup directory
  const backupCustomTypes = await readDirectory(paths.backupDirectory)
  const readFilesPromises = backupCustomTypes.map(backupCustomTypeFile => readFile(path.join(paths.backupDirectory, backupCustomTypeFile)))
  const fileCustomTypes = (await Promise.all(readFilesPromises)).map(JSON.parse)

  const updates = []

  // For each custom types in Prismic
  for (let prismicCustomTypeIndex = prismicCustomTypes.length - 1; prismicCustomTypeIndex >= 0; prismicCustomTypeIndex--) {
    const prismicCustomType = prismicCustomTypes[prismicCustomTypeIndex]

    // Try to find it in files
    const index = fileCustomTypes.findIndex(fileCustomType => fileCustomType.id === prismicCustomType.id)

    if (index > -1) {
      const fileCustomType = fileCustomTypes[index]

      // Remove custom type from local and Prismic arrays
      prismicCustomTypes.splice(prismicCustomTypeIndex, 1)
      fileCustomTypes.splice(index, 1)

      // Check if common custom type need to be updated
      if (JSON.stringify(fileCustomType.json) !== JSON.stringify(prismicCustomType.json) || fileCustomType.status !== prismicCustomType.status) {
        updates.push(fileCustomType)
      }
    }
  }

  // Here stay:
  //
  // fileCustomTypes => CREATE
  // prismicCustomTypes => DELETE
  // updates => UPDATE

  if (fileCustomTypes.length === 0 && updates.length === 0 && prismicCustomTypes.length === 0) {
    console.log('Already up-to-date')
    return
  }

  const choices = [{
    items: fileCustomTypes,
    action: 'create',
    separatorText: ' = Create = '
  }, {
    items: updates,
    action: 'update',
    separatorText: ' = Update = '
  }, {
    items: prismicCustomTypes,
    action: 'delete',
    separatorText: ' = Delete = '
  }]
    .reduce((choices, actionType) => {
      if (actionType.items.length > 0) {
        choices.push(new inquirer.Separator(actionType.separatorText))
        choices.push(...actionType.items.map(customType => {
          return {
            name: `${capitalize(actionType.action)} ${customType.label} (${customType.id})`,
            value: { action: actionType.action, customType },
            checked: true
          }
        }))
      }

      return choices
    }, [])

  const actions = (await inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select actions',
        name: 'actions',
        loop: false,
        choices
      }
    ])).actions

  const promises = actions
    .map(action => {
      if (action.action === 'create') {
        return Api.create(action.customType)
          .then(_ => {
            console.log(chalk.green(`✅  Created "${action.customType.label}" custom type`))
          })
      }
      if (action.action === 'update') {
        return Api.update(action.customType)
          .then(_ => {
            console.log(chalk.green(`✅  Updated "${action.customType.label}" custom type`))
          })
      }
      if (action.action === 'delete') {
        return Api.delete(action.customType.id)
          .then(_ => {
            console.log(chalk.green(`✅  Deleted "${action.customType.label}" custom type`))
          })
      }

      return null
    })

  await Promise.all(promises)

  console.log()
  console.log('✨ Your Prismic custom types are up to date ! ✨')
}
