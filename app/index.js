require('dotenv').config()

const { start } = require('./actions/monitoring')
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const repeat = 1 === 1

;(async () => {
  do {
    console.log(new Date())
    start()
    await sleep(1000 * 60 * 15)
  } while (repeat)
})()
