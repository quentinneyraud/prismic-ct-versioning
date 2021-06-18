import fs from 'fs/promises'
import rimraf from 'rimraf'

export const isDirectoryExists = async path => {
  try {
    await fs.access(path)
    return true
  } catch (err) {
    return false
  }
}

export const createDirectory = async path => {
  return await fs.mkdir(path, { recursive: true })
}

export const readDirectory = async path => {
  return await fs.readdir(path)
}

export const createFile = async (path, data) => {
  return await fs.writeFile(path, data, { encoding: 'utf-8' })
}

export const readFile = async (path) => {
  return await fs.readFile(path, { encoding: 'utf-8' })
}

export const removeDirectory = (path) => {
  return new Promise((resolve, reject) => {
    rimraf(path, {}, err => {
      if (err) reject(err)

      resolve()
    })
  })
}
