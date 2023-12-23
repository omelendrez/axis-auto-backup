const path = require('path')
const { api } = require('../services/api-service')
const { getDocuments, getDocumentURL, download } = require('./documents')

/**
 * This method starts the document restore process
 */
const start = () => {
  getDocuments()
    .then((docs) => {
      docs.forEach((doc) => {
        const file = doc.file
        const destination = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'axis-assets',
          file
        )

        getDocumentURL(doc.file)
          .then((url) => {
            download(url, destination, () => {
              if (file.includes('sql')) {
                api.delete(`s3-document${file}`)
              } else {
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
