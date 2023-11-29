import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import FormData from 'form-data'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const up = (folders) =>
  new Promise((resolve) => {
    ;(async () => {
      for (const currentFolder of folders) {
        const fieldExtension = currentFolder.fieldExtension
        const root = currentFolder.root
        const folderName = currentFolder.folderName
        const url = currentFolder.url
        const folder = `./${root}/${folderName}`

        let lastRecord = null

        const lastRecordFile = path.join(__dirname, root, `${folderName}.txt`)

        if (fs.existsSync(lastRecordFile)) {
          lastRecord = await fs.readFileSync(lastRecordFile).toString()
        }

        const files = fs
          .readdirSync(path.join(__dirname, folder))
          .filter((f) => f.includes(fieldExtension))
          .filter((f) => lastRecord && f < lastRecord)
          .reverse()

        let counter = 1
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

          counter++

          try {
            const { data } = await axios.get(
              `${process.env.ASSETS_URL}${folderName}/${file}/exists`
            )

            if (!data.exists) {
              await axios.post(`${process.env.ASSETS_URL}${url}`, formData, {
                headers
              })
            }
          } catch (error) {
            console.log('error', error.message)
          }
          await fs.writeFileSync(lastRecordFile, file)
        }
        console.log(`Upload from ${folder} complete! ${counter} files`)
        await fs.writeFileSync(lastRecordFile, 'zzz')
      }
    })()
    resolve()
  })
