const imgur = require('imgur-node-api')

imgur.setClientID(process.env.IMGUR_CLIENT_ID)

module.exports = (file) => {
  return new Promise((resolve, reject) => {
    imgur.upload(file.path, (err, img) => {
      if (err) return reject(err)
      return resolve(img)
    })
  })
}
