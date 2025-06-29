import { createEntrypoint } from './Entrypoint.js'
import { ConfigProvider } from './Utils/Config/ConfigProvider.js'
import { FileProvider } from './Utils/File/FileProvider.js'

const main = createEntrypoint(new ConfigProvider(), new FileProvider())

main.handle()
