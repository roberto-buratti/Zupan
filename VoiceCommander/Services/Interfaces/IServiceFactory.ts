import IVoiceManager from './IVoiceManager'
import IServiceManager from './IServiceManager'

export default interface IServiceFactory {
  voiceManager: IVoiceManager
  serviceManager: IServiceManager
}