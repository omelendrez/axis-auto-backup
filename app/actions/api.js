const { api } = require('../services/api-service')

const getDownloadPendingDocumets = async () =>
  new Promise((resolve, reject) =>
    api
      .get('s3-document?status=0')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  )

module.exports = { getDownloadPendingDocumets }
