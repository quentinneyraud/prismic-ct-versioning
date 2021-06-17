/* eslint-disable no-console */

import path from 'path'
import chalk from 'chalk'
import Api from './api.js'
import inquirer from 'inquirer'
import { createDirectory, createFile } from './files.js'

export const run = async (command, args, paths) => {
  if (command === 'backup') {
    const prismicCustomTypes = await Api.getAll()

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

    const date = new Date()

    const promises = prismicCustomTypes
      .filter(customType => customTypesChoiceIds.includes(customType.id))
      .map(async customType => {
        const fileName = `${customType.id}_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours()}:${date.getMinutes()}.json`
        const fileNamePath = path.resolve(paths.backupDirectory, customType.id, fileName)

        await createDirectory(path.dirname(fileNamePath))
        await createFile(fileNamePath, JSON.stringify(customType.json, null, 2))

        console.log(chalk.green(`✅  "${customType.label}" custom type saved in : `) + path.relative(paths.root, fileNamePath))
      })

    await Promise.all(promises)

    console.log()
    console.log('✨ All custom types are saved ! ✨')
  }
}
