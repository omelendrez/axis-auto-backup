const { getDocumentUrl } = require('../services/s3-service')
const { getDownloadPendingDocumets } = require('./api')

const fs = require('node:fs')
const https = require('https')

const download = function (url, destination, cb) {
  if (!fs.existsSync(destination)) {
    const file = fs.createWriteStream(destination)

    const request = https
      .get(url, function (response) {
        response.pipe(file)
        file.on('finish', function () {
          file.close(cb)
        })
      })
      .on('error', function (err) {
        fs.unlink(destination)
        if (cb) cb(err.message)
      })

    request.on('error', function (err) {
      console.log(err)
    })
  }
}

const getDocuments = () =>
  new Promise((resolve, reject) =>
    getDownloadPendingDocumets()
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  )

const getDocumentURL = (file) =>
  new Promise((resolve, reject) =>
    getDocumentUrl(file)
      .then((url) => resolve(url))
      .catch((err) => reject(err))
  )

module.exports = { download, getDocuments, getDocumentURL }
