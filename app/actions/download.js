const fs = require('fs')
const path = require('path')
const https = require('https')
const axios = require('axios')

const pool = require('../models/db')
const { documentNumber } = require('../helpers/format')
const { FILENAME_FROM, DAYS_TO_UPDATE } = require('../helpers/constants')

const localAssets = process.env.LOCAL_ASSETS_URL
const remoteAssets = process.env.REMOTE_ASSETS_URL

// download the image and save to /img
const downloadDocument = function (url, dest, cb) {
  const destination = path.join(__dirname, '..', dest)
  let file = fs.createWriteStream(destination)
  let request = https
    .get(url, function (response) {
      response.pipe(file)
      file.on('finish', function () {
        file.close(cb)
      })
    })
    .on('error', function (err) {
      fs.unlink(destination) // Delete the file async if there is an error
      if (cb) cb(err.message)
    })

  request.on('error', function (err) {
    console.log(err)
  })
}

const queryServers = (fileName, f) =>
  new Promise((resolve) =>
    (async () => {
      const file = `${f.folderName}/${fileName}`
      const localUrl = `${localAssets}${file}`
      const remoteUrl = `${remoteAssets}${file}`

      const dest = `./${f.root}/${f.folderName}/${fileName}`

      const { data: remote } = await axios.get(`${remoteUrl}/exists`)
      const { data: local } = await axios.get(`${localUrl}/exists`)

      if (remote.exists && !local.exists) {
        downloadDocument(remoteUrl, dest, (err) => {
          if (err) {
            console.log(err)
          }
        })
        resolve({ file })
      } else {
        resolve()
      }
    })()
  )

const down = (folders) =>
  new Promise((resolve) =>
    (async () => {
      const learnerDocuments = folders.filter(
        (l) => l.filenameFrom === FILENAME_FROM.BADGE
      )

      const trainingDocuments = folders.filter(
        (t) => t.filenameFrom === FILENAME_FROM.TRAINING_ID
      )

      const [trainings] = await pool.query(
        'SELECT DISTINCT training FROM training_tracking WHERE DATEDIFF(NOW(), updated)<?;',
        DAYS_TO_UPDATE
      )

      const [learners] = await pool.query(
        'SELECT DISTINCT badge FROM learner WHERE id IN (SELECT learner FROM training WHERE id IN (SELECT DISTINCT training FROM training_tracking WHERE DATEDIFF(NOW(), updated)<?));',
        DAYS_TO_UPDATE
      )

      for (const t of trainings) {
        for (const f of trainingDocuments) {
          const docNumber = await documentNumber(t.training)
          const fileName = `${docNumber}${f.fileExtension}`
          const resp = await queryServers(fileName, f)
          if (resp) {
            console.log(resp)
          }
        }
      }

      for (const l of learners) {
        for (const f of learnerDocuments) {
          const fileName = `${l.badge}${f.fileExtension}`
          const resp = await queryServers(fileName, f)
          if (resp) {
            console.log(resp)
          }
        }
      }

      resolve('Process completed')
    })()
  )

module.exports = { down }
