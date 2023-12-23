const { api } = require('../services/api-service')

/**
 * Calls backend api to get s3_document table results
 * @returns List of s3 documents pending to process
 */
const getDownloadPendingDocuments = async () =>
  new Promise((resolve, reject) =>
    api
      .get('s3-document?status=0')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err))
  )

module.exports = { getDownloadPendingDocuments }
