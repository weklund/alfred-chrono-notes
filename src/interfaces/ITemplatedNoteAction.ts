interface ITemplatedNoteAction {
    hasConfig: () => boolean
    getTemplatePath: (templateFilePath: string) => string
    getFilePath: (filePath: string) => string
    getFileFormat: (tokenFormat: string) => string
    open: (obsidianFullURI: string) => void
}