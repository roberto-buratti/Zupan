import IServiceFactory from "../../Services/Interfaces/IServiceFactory"

import BaseViewModel from "../BaseViewModel"
import IHomeViewModel from "./IHomeViewModel"
import IVoiceCommanderViewModel from "../VoiceCommander/IVoiceCommanderViewModel"
import VoiceCommanderViewModel from "../VoiceCommander/VoiceCommanderViewModel"

export default class HomeViewModel extends BaseViewModel implements IHomeViewModel {
  constructor(serviceFactory: IServiceFactory) {
    super(serviceFactory)
  }

  public voiceCommanderViewModel(): IVoiceCommanderViewModel {
    return new VoiceCommanderViewModel(this._serviceFactory);
  }
}