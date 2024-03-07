const { getDocumentUrl } = require('../services/s3-service')
const { getDownloadPendingDocuments } = require('./api')

const fs = require('node:fs')
const https = require('https')
const { FILE_STATUS } = require('../utils/constants')

/**
 * Download files from S3
 * @param {string} url
 * @param {string} destination
 * @param {function} cb
 */
const download = function (url, destination, cb) {
  if (!fs.existsSync(destination)) {
    const file = fs.createWriteStream(destination)

    const request = https
      .get(url, (response) => {
        response.pipe(file)
        file.on('finish', function () {
          if (cb)
            cb({ status: FILE_STATUS.OK, message: `${destination} downloaded` })
          file.close()
        })
      })
      .on('error', (err) => {
        fs.unlink(destination)
        if (cb)
          cb({
            status: FILE_STATUS.ERROR,
            message: `${destination} ${err.message}`
          })
      })

    request.on('error', function (err) {
      if (cb)
        cb({
          status: FILE_STATUS.ERROR,
          message: `${destination} ${err.message}`
        })
    })
  } else {
    cb({ status: FILE_STATUS.EXISTS, message: `${destination} already exists` })
  }
}

const getDocuments = () =>
  new Promise((resolve, reject) =>
    getDownloadPendingDocuments()
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
