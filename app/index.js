const dotenv = require('dotenv')
const express = require('express')

// const { up } = require('./actions/upload')
const { down } = require('./actions/download')
const { FILENAME_FROM, SCOPE } = require('./helpers/constants')

dotenv.config()

const app = express()

app.use(express.json())

const FOLDERS = [
  {
    fileExtension: '.pdf',
    root: 'exports',
    folderName: 'certificates',
    url: 'opito/upload',
    scope: SCOPE.UPLOAD_AND_DOWNLOAD,
    filenameFrom: FILENAME_FROM.TRAINING_ID
  },
  {
    fileExtension: '.pdf',
    root: 'exports',
    folderName: 'id-cards',
    url: 'exports/id-cards',
    scope: SCOPE.DOWNLOAD_ONLY,
    filenameFrom: FILENAME_FROM.TRAINING_ID
  },
  // {
  //   fileExtension: '.csv',
  //   root: 'exports',
  //   folderName: 'opito/csv',
  //   url: 'opito/csv',
  //   scope: SCOPE.DOWNLOAD_ONLY,
  //   filenameFrom: FILENAME_FROM.DATE_COURSE_ID
  // },
  {
    fileExtension: '.pdf',
    root: 'exports',
    folderName: 'welcome-letter',
    url: 'exports/welcome-letter',
    scope: SCOPE.DOWNLOAD_ONLY,
    filenameFrom: FILENAME_FROM.TRAINING_ID
  },
  {
    fileExtension: '.jpg',
    root: 'uploads',
    folderName: 'foets',
    url: 'foets',
    scope: SCOPE.UPLOAD_AND_DOWNLOAD,
    filenameFrom: FILENAME_FROM.TRAINING_ID
  },
  {
    fileExtension: '.jpg',
    root: 'uploads',
    folderName: 'learner-ids',
    url: 'learner-ids/restore',
    scope: SCOPE.UPLOAD_AND_DOWNLOAD,
    filenameFrom: FILENAME_FROM.BADGE
  },
  {
    fileExtension: '.jpg',
    root: 'uploads',
    folderName: 'payments',
    url: 'payments',
    scope: SCOPE.UPLOAD_AND_DOWNLOAD,
    filenameFrom: FILENAME_FROM.TRAINING_ID
  },
  {
    fileExtension: '.jpg',
    root: 'uploads',
    folderName: 'pictures',
    url: 'pictures',
    scope: SCOPE.UPLOAD_AND_DOWNLOAD,
    filenameFrom: FILENAME_FROM.BADGE
  }
]

// up(
//   FOLDERS.filter(
//     (f) =>
//       f.scope === SCOPE.UPLOAD_AND_DOWNLOAD || f.scope === SCOPE.UPLOAD_ONLY
//   )
// )
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err))
//   .finally(() => process.exit())

down(
  FOLDERS.filter(
    (f) =>
      f.scope === SCOPE.UPLOAD_AND_DOWNLOAD || f.scope === SCOPE.DOWNLOAD_ONLY
  )
)
  .then((res) => console.log(res))
  .catch((err) => console.log(err))
  .finally(() => process.exit())
