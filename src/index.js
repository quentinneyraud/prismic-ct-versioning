const api = require('./api')

const a = async _ => {
  const all = await api.getById('translations')
  console.log('all:', all)
}

a()
