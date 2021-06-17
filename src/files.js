import fs from 'fs/promises'

export const createDirectory = async path => {
  await fs.mkdir(path, { recursive: true })
}

export const createFile = async (path, data) => {
  await fs.writeFile(path, data)
}
