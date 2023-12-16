const path = require('path')
const { api } = require('../services/api-service')
const { getDocuments, getDocumentURL, download } = require('./documents')

const start = () => {
  getDocuments()
    .then((docs) => {
      docs.forEach((doc) => {
        const destination = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'axis-assets',
          doc.file
        )

        getDocumentURL(doc.file)
          .then((url) => {
            download(url, destination, () => {
              api.put('s3-document', { file: doc.file, status: 1 })
            })
          })
          .catch((err) => console.log(err))
      })
    })
    .catch((err) => console.log(err))
}

module.exports = { start }
