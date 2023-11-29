const dotenv = require('dotenv')
const express = require('express')

const { up } = require('./actions/upload')
const { down } = require('./actions/download')

dotenv.config()

const app = express()

app.use(express.json())

const FOLDERS = [
  {
    fieldExtension: '.pdf',
    root: 'exports',
    folderName: 'certificates',
    url: 'opito/upload'
  },
  {
    fieldExtension: '.jpg',
    root: 'uploads',
    folderName: 'foets',
    url: 'foets'
  },
  {
    fieldExtension: '.jpg',
    root: 'uploads',
    folderName: 'learner-ids',
    url: 'learner-ids/restore'
  },
  {
    fieldExtension: '.jpg',
    root: 'uploads',
    folderName: 'payments',
    url: 'payments'
  },
  {
    fieldExtension: '.jpg',
    root: 'uploads',
    folderName: 'pictures',
    url: 'pictures'
  }
]

// up(FOLDERS)
// process.exit()

up(FOLDERS)

// down(FOLDERS)
