import ConfigModel from "../../Models/ConfigModel"

export default interface IServiceManager {
    getConfig(): Promise<ConfigModel>
}
