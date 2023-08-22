import IServiceFactory from '../Services/Interfaces/IServiceFactory'

import IBaseViewModel from './IBaseViewModel'

export default class BaseViewModel implements IBaseViewModel {
  protected _serviceFactory: IServiceFactory

  constructor(serviceFactory: IServiceFactory) {
    this._serviceFactory = serviceFactory;
  }

}
