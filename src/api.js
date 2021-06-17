import axios from 'axios'

const BASE_URL = 'https://customtypes.prismic.io/customtypes'

class Api {
  createClient ({ token, repository }) {
    this.instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        repository: repository,
        Authorization: `Bearer ${token}`
      }
    })
  }

  async getAll ({ getDisabled = false } = {}) {
    try {
      const response = await this.instance.get()
      let customTypes = null

      if (response.status === 200 && response.statusText === 'OK') {
        customTypes = response.data

        if (!getDisabled) {
          customTypes = customTypes.filter(customType => customType.status)
        }

        return customTypes
      }

      return null
    } catch (err) {
      return null
    }
  }

  async getById (id) {
    try {
      const response = await this.instance.get(id)

      if (response.status === 200 && response.statusText === 'OK') {
        return response.data
      }

      return null
    } catch (err) {
      return null
    }
  }
}

export default new Api()
