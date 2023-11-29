export const down = (folders) =>
  new Promise((resolve) =>
    (async () => {
      for await (const currentFolder of folders) {
        console.log(currentFolder)
      }
      resolve()
    })()
  )
