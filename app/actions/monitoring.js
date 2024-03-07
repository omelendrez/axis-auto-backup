const path = require('path')
const { api } = require('../services/api-service')
const { getDocuments, getDocumentURL, download } = require('./documents')
const { FILE_STATUS } = require('../utils/constants')

/**
 * This method starts the document restore process from AWS S3 to local assets server
 */
const start = () => {
  // gets the list of s3-document table records having status=0
  // endpoint sends 50 records per call
  getDocuments()
    .then((docs) => {
      docs.forEach(async (doc) => {
        const file = doc.file
        // sets the file full path to assets documents folders
        const destination = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'axis-assets',
          file
        )

        // gets the document url with s3-request-pre-signer.getSignedUrl
        await getDocumentURL(doc.file)
          .then(async (url) => {
            //  converts the file url to stream and stores in destination folder
            await download(url, destination, (res) => {
              if (res.status !== FILE_STATUS.EXISTS) {
                console.log(res.message)
              }
              if (res.status !== FILE_STATUS.ERROR) {
                // changes record status in s3-document table to '1'
                api.put('s3-document', { file, status: 1 })
              }
            })
          })
          .catch((err) => console.log(err))
      })
    })
    .catch((err) => console.log(err))
}

module.exports = { start }
