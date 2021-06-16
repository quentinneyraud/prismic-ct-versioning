const axios = require('axios')

const BASE_URL = 'https://customtypes.prismic.io/customtypes'
const PRISMIC_TOKEN = process.env.PRISMIC_TOKEN
const PRISMIC_REPOSITORY = process.env.PRISMIC_REPOSITORY

// Axios instance with defaults
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    repository: PRISMIC_REPOSITORY,
    Authorization: `Bearer ${PRISMIC_TOKEN}`
  }
});

module.exports = {
  async getAll () {
    try {
      const response = await instance.get()

      if (response.status === 200 && response.statusText === 'OK') {
        return response.data
      }

      return null
    } catch (err) {
      return null
    }
  },
  async getById (id) {
    try {
      const response = await instance.get(id)

      if (response.status === 200 && response.statusText === 'OK') {
        return response.data
      }

      return null
    } catch (err) {
      return null
    }
  }
}
