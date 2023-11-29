const down = (folders) =>
  new Promise((resolve) =>
    (async () => {
      const assetsUrl = process.env.ASSETS_URL

      for await (const currentFolder of folders) {
        console.log(currentFolder)
      }
      resolve()
    })()
  )

module.exports = { down }
