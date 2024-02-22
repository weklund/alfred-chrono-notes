import {createEntrypoint} from './Entrypoint'
import {ConfigProvider} from "./Utils/Config/ConfigProvider"
import {FileProvider} from "./Utils/File/FileProvider"

const main = createEntrypoint(
    new ConfigProvider(),
    new FileProvider()
)

main.handle()