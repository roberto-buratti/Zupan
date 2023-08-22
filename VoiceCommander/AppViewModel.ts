import IServiceFactory from "./Services/Interfaces/IServiceFactory"

import IAppViewModel from "./IAppViewModel"

import BaseViewModel from "./Scenes/BaseViewModel"
import IHomeViewModel from "./Scenes/Home/IHomeViewModel"
import HomeViewModel from "./Scenes/Home/HomeViewModel"

export default class AppViewModel extends BaseViewModel implements IAppViewModel {

    constructor(serviceFactory: IServiceFactory) {
        super(serviceFactory)
    }

    public homeViewModel(): IHomeViewModel {
        return new HomeViewModel(this._serviceFactory)
    }

}