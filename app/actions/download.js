/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
const fs = require('node:fs')
const path = require('path')
const https = require('https')
const axios = require('axios')

const pool = require('../models/db')
const { documentNumber } = require('../helpers/format')
const { FILENAME_FROM, DAYS_TO_UPDATE } = require('../helpers/constants')

// const localAssets = process.env.LOCAL_ASSETS_URL
const remoteAssets = process.env.REMOTE_ASSETS_URL
const localAssetsServer = process.env.LOCAL_ASSETS_FOLDER

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const downloadDocument = function (url, destination, cb) {
  let file = fs.createWriteStream(destination)
  console.log(`downloading ${destination}`)
  let request = https
    .get(url, function (response) {
      response.pipe(file)
      file.on('finish', function () {
        console.log('complete')
        file.close(cb)
      })
    })
    .on('error', function (err) {
      fs.unlink(destination)
      if (cb) cb(err.message)
    })

  request.on('error', function (err) {
    console.log(err)
  })
}

const queryServers = (fileName, f) =>
  new Promise((resolve) =>
    (async () => {
      // await delay(1000)

      const file = `${f.folderName}/${fileName}`
      // const localUrl = `${localAssets}${file}`
      const remoteUrl = `${remoteAssets}${file}`
      console.log(`Checking ${file}`)
      const dest = `./${f.root}/${f.folderName}/${fileName}`

      const { data: remote } = await axios.get(`${remoteUrl}/exists`)
      // const { data: local } = await axios.get(`${localUrl}/exists`)

      if (remote.exists) {
        const destination = path.join(localAssetsServer, dest)
        if (!fs.existsSync(destination)) {
          downloadDocument(remoteUrl, destination, (err) => {
            if (err) {
              console.log(err)
            }
          })
          resolve(`${f.root}/${file}`)
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })()
  )

const doTrainingDocuments = (folders) =>
  new Promise((resolve) =>
    (async () => {
      console.log('Training documents')

      // const [trainings] = await pool.query(
      //   "SELECT id training FROM training WHERE start >= '2023-01-01'"
      // )

      const trainingDocuments = folders.filter(
        (t) => t.filenameFrom === FILENAME_FROM.TRAINING_ID
      )

      const trainings = await fs
        .readFileSync('./training.txt')
        .toString()
        .split('\n')

      for (const t of trainings) {
        for (const f of trainingDocuments) {
          const docNumber = await documentNumber(t)
          const fileName = `${docNumber}${f.fileExtension}`
          const resp = await queryServers(fileName, f)
          if (resp) {
            console.log(resp)
          }
        }
      }
      resolve('Training documents completed!')
    })()
  )

const doLearnerDocuments = (folders) =>
  new Promise((resolve) =>
    (async () => {
      console.log('Learners documents')

      // const [learners] = await pool.query(
      //   "SELECT DISTINCT badge FROM learner WHERE id IN (SELECT DISTINCT learner FROM training WHERE start >= '2023-01-01');"
      // )

      const learnerDocuments = folders.filter(
        (l) => l.filenameFrom === FILENAME_FROM.BADGE
      )

      const learners = await fs
        .readFileSync('./learner.txt')
        .toString()
        .split('\n')

      for (const l of learners) {
        for (const f of learnerDocuments) {
          const fileName = `${l}${f.fileExtension}`
          const resp = await queryServers(fileName, f)
          if (resp) {
            console.log(resp)
          }
        }
      }
      resolve('Learner documents completed!')
    })()
  )

const doLearnerPhoto = (folders) =>
  new Promise((resolve) =>
    (async () => {
      console.log('Training photographs')

      const destination = path.join(__dirname, '..', 'uploads', 'pictures')

      const lastPhoto = await fs
        .readdirSync(destination)
        .reverse()[0]
        .split('.')[0]

      const [photos] = await pool.query(
        'SELECT badge FROM learner WHERE badge>?;',
        lastPhoto
      )

      const m = folders.find((f) => f.folderName === 'pictures')

      for (const p of photos) {
        const fileName = `${p.badge}${m.fileExtension}`
        const resp = await queryServers(fileName, m)
        if (resp) {
          console.log(resp)
        }
      }
      resolve('Leaner photos completed!')
    })()
  )

const down = (folders) =>
  new Promise((resolve) =>
    (async () => {
      // const t = await doTrainingDocuments(folders)
      // console.log(t)
      // console.log()

      const l = await doLearnerDocuments(folders)
      console.log(l)
      console.log()

      // const p = await doLearnerPhoto(folders)
      // console.log(p)
      // console.log()

      resolve('Download process completed successfuly.')
    })()
  )

module.exports = { down }
