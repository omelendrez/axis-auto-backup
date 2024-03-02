require('dotenv').config()

const { start } = require('./actions/monitoring')
const { DOWNLOAD_FREQUENCY } = require('./utils/constants')
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const repeat = 1 === 1

;(async () => {
  do {
    console.log(new Date())
    start()
    // await sleep(1000 * 60 * 15)
    await sleep(DOWNLOAD_FREQUENCY)
  } while (repeat)
})()
