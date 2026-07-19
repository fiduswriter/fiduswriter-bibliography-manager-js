addEventListener("message", async message => {
    const {BibliographyImportWorker} = await import("./bibliography.js")
    const {fileContents, format} = message.data
    const worker = new BibliographyImportWorker(
        fileContents,
        postMessage.bind(self),
        format
    )
    worker.init()
})
