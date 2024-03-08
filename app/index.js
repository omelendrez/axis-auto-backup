require('dotenv').config()

const { start } = require('./actions/monitoring')
const { DOWNLOAD_FREQUENCY } = require('./utils/constants')
const { isWorkingTime } = require('./utils/helpers')
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const repeat = true

;(async () => {
  do {
    const now = new Date()
    if (isWorkingTime(now)) {
      console.log(now)
      start()
    }
    await sleep(DOWNLOAD_FREQUENCY)
  } while (repeat)
})()
