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

  async create (data) {
    try {
      const response = await this.instance.post('insert', data, {
        'Content-Type': 'application/json'
      })

      if (response.status === 201 && response.statusText === 'Created') {
        return true
      }

      if (response.status === 409) {
        throw new Error('Custom type with same ID already exists')
      }

      return null
    } catch (err) {
      return null
    }
  }

  async update (data) {
    try {
      const response = await this.instance.post('update', data, {
        'Content-Type': 'application/json'
      })

      if (response.status === 204 && response.statusText === 'No Content') {
        return true
      }

      if (response.status === 422) {
        throw new Error('No custom type with this ID exists')
      }

      return null
    } catch (err) {
      return null
    }
  }

  async delete (id) {
    try {
      const response = await this.instance.delete(id)

      if (response.status === 204 && response.statusText === 'No Content') {
        return true
      }

      return null
    } catch (err) {
      return null
    }
  }
}

export default new Api()
