const getDocumentUrl = (file) =>
  new Promise((resolve, reject) =>
    (async () => {
      try {
        const filePath = file.split('/')
        filePath.shift()
        const url = `${process.env.DOCS_URL}/${filePath.join('/')}`
        resolve(url)
      } catch (error) {
        reject(error)
      }
    })()
  )

module.exports = {
  getDocumentUrl
}
