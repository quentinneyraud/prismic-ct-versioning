import fs from 'fs/promises'
import rimraf from 'rimraf'

export const createDirectory = async path => {
  await fs.mkdir(path, { recursive: true })
}

export const createFile = async (path, data) => {
  await fs.writeFile(path, data)
}

export const removeDirectory = (path) => {
  return new Promise((resolve, reject) => {
    rimraf(path, {}, err => {
      if (err) reject(err)

      resolve()
    })
  })
}
