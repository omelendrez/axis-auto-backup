const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

const up = (folders) =>
  new Promise((resolve) => {
    const run = async () => {
      const assetsUrl = process.env.ASSETS_URL
      for (const currentFolder of folders) {
        const fileExtension = currentFolder.fileExtension
        const root = currentFolder.root
        const folderName = currentFolder.folderName
        const url = currentFolder.url
        const folder = `./${root}/${folderName}`

        let lastRecord = null

        const lastRecordFile = path.join(
          __dirname,
          '..',
          root,
          `${folderName}.txt`
        )

        if (fs.existsSync(lastRecordFile)) {
          lastRecord = await fs.readFileSync(lastRecordFile).toString()
        } else {
          lastRecord = 'zzzz'
          await fs.writeFileSync(lastRecordFile, lastRecord)
        }

        const files = fs
          .readdirSync(path.join(__dirname, '..', folder))
          .filter((f) => f.includes(fileExtension))
          .filter((f) => lastRecord && f < lastRecord)
          .reverse()

        let exists = 0
        let filesAdded = 0
        for (const file of files) {
          const formData = new FormData()

          const sourceFile = await path.join(__dirname, `${folder}/${file}`)

          const fileData = await fs.createReadStream(sourceFile)

          formData.append('name', file.split('.')[0])
          formData.append('file', fileData)

          const headers = {
            ...formData.getHeaders(),
            'Content-Type': 'multipart/form-data'
          }

          try {
            let { data } = await axios.get(
              `${assetsUrl}${folderName}/${file}/exists`
            )

            if (!data.exists) {
              await axios.post(`${assetsUrl}${url}`, formData, {
                headers
              })
              filesAdded++
            } else {
              exists++
            }
          } catch (error) {
            console.log('error', error.message)
          }
          await fs.writeFileSync(lastRecordFile, file)
        }
        console.log(
          `Upload from ${folder} complete! ${filesAdded} files added, ${exists} files already exist`
        )
      }
    }
    run()
    resolve()
  })

module.exports = { up }
