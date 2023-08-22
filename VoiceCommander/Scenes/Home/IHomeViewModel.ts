import IVoiceCommanderViewModel from "../VoiceCommander/IVoiceCommanderViewModel"
import IBaseViewModel from "../IBaseViewModel"

export default interface IHomeViewModel extends IBaseViewModel {
    voiceCommanderViewModel(): IVoiceCommanderViewModel
}