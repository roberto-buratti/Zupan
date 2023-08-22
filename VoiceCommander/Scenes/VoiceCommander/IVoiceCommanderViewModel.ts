import IBaseViewModel from "../IBaseViewModel"
import SpeechResultsModel from "../../Models/SpeechResultsModel"

export default interface IVoiceCommanderViewModel extends IBaseViewModel {
    knownTerms: string[]
    setup(delegate: IVoiceCommanderViewModelDelegate): Promise<void>
    startRecording(): Promise<void>
    stopRecording(): Promise<void>
}

export enum IVoiceCommanderViewModelVisualCue {
    CurrentCommandChanged,
    CurrentCommandDeleted,
    LastCommandDeleted,
}

export interface IVoiceCommanderViewModelDelegate {
    isLoading(status: boolean): void
    isRecording(status: boolean): void
    onError(error: unknown): void
    onSpeechResults(results: SpeechResultsModel, visualCue?: IVoiceCommanderViewModelVisualCue): void
}