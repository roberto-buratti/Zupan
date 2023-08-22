import ConfigModel from "../Models/ConfigModel"
import IServiceManager from "./Interfaces/IServiceManager"
import NetworkManager from "./NetworkManager"

export default class ServiceManager implements IServiceManager {
    private static _shared: IServiceManager = new ServiceManager()
    public static get shared(): IServiceManager {
        return this._shared;
    }

    private _networkManager: NetworkManager = new NetworkManager()

    public async getConfig(): Promise<ConfigModel> {
        let result = await this._networkManager.getConfig()
        console.log(`*** ServiceManager:getConfig: result=${JSON.stringify(result)}`)
        return new ConfigModel(result)
    }

    // MARK: - Private

}