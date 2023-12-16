require('dotenv').config()

const axios = require('axios')

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

console.log(process.env.API_URL)

module.exports = { api }
