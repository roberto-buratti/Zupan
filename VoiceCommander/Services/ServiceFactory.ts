import IServiceFactory from './Interfaces/IServiceFactory'
import IVoiceManager from './Interfaces/IVoiceManager'
import IServiceManager from './Interfaces/IServiceManager'

import VoiceManager from './VoiceManager'
import ServiceManager from './ServiceManager'

export default class ServiceFactory implements IServiceFactory {

  public get voiceManager(): IVoiceManager {
    return VoiceManager.shared as IVoiceManager
  }

  public get serviceManager(): IServiceManager {
    return ServiceManager.shared as IServiceManager
  }
}