import IServiceFactory from "../../Services/Interfaces/IServiceFactory"

import ConfigModel from "../../Models/ConfigModel"
import SpeechResultsModel from "../../Models/SpeechResultsModel"

import BaseViewModel from "../BaseViewModel"
import IVoiceCommanderViewModel, { IVoiceCommanderViewModelDelegate, IVoiceCommanderViewModelVisualCue } from "./IVoiceCommanderViewModel"

import IVoiceManager, { VoiceManagerEvents } from "../../Services/Interfaces/IVoiceManager"

import * as copy from "../../Assets/Copy"

export default class VoiceCommanderViewModel extends BaseViewModel implements IVoiceCommanderViewModel {
  private _delegate?: IVoiceCommanderViewModelDelegate
  private _config?: ConfigModel
  private _previousResults?: SpeechResultsModel

  constructor(serviceFactory: IServiceFactory) {
    super(serviceFactory)
  }

  public get knownTerms(): string[] {
    if (!this._config) {
      return ["..."]
    }
    const language = copy.getSystemLanguage()
    return Object.values(this._config.commands).map(c => c.term(language))
  }

  public async setup(delegate?: IVoiceCommanderViewModelDelegate) {
    this._delegate = delegate
    this._delegate?.isLoading(true)
    const serviceManager = this._serviceFactory.serviceManager
    const voiceManager = this._serviceFactory.voiceManager
    if (!this._config) {
      try {
        this._config = await serviceManager.getConfig()
        voiceManager.setup(this._config.commands)
      } catch (error) {
        this._delegate?.onError(error)
      }
    }
    voiceManager.events.addListener(VoiceManagerEvents.onStartRecording, () => {
      this._delegate?.isRecording(true)
    })
    voiceManager.events.addListener(VoiceManagerEvents.onStopRecording, () => {
      this._delegate?.isRecording(false)
    })
    voiceManager.events.addListener(VoiceManagerEvents.onSpeechResults, (results: SpeechResultsModel) => {
      let visualCue: IVoiceCommanderViewModelVisualCue | undefined = undefined
      if (results.last) {
        const template = this._config?.commands[results.last?.name]
        const action = template?.action
        switch (action) {
          case "clear":
            if (this._previousResults?.current && this._previousResults?.current.value) {
              visualCue = IVoiceCommanderViewModelVisualCue.CurrentCommandChanged
            } else {
              visualCue = undefined
            }
            break
          case "back":
            if (this._previousResults?.current && !results.current) {
              visualCue = IVoiceCommanderViewModelVisualCue.CurrentCommandDeleted
            } else {
              visualCue = IVoiceCommanderViewModelVisualCue.LastCommandDeleted
            }
            break
          default:
            visualCue = undefined
            break
        }
      }
      this._delegate?.onSpeechResults(results, visualCue)
      this._previousResults = results
    })
    voiceManager.events.addListener(VoiceManagerEvents.onSpeechError, (error: any) => {
      console.log(`*** VoiceCommanderViewModel:onSpeechError: error=${JSON.stringify(error)}`)
      this._delegate?.onError(error)
    })
    // [ROB] fake delay just to show visual effect of <isLoading>
    setTimeout(() => {
      this._delegate?.isLoading(false)
    }, 2000)
  }

  public async startRecording() {
    try {
      const voiceManager = this._serviceFactory.voiceManager
      await voiceManager.startRecording()
    } catch (error) {
      this._delegate?.onError(error)
    }
  }

  public async stopRecording() {
    try {
      const voiceManager = this._serviceFactory.voiceManager as IVoiceManager
      // console.log(`*** VoiceCommanderViewModel:stopRecording: voiceManager=${JSON.stringify(voiceManager)}`)
      await voiceManager.stopRecording()
    } catch (error: any) {
      this._delegate?.onError(error)
    }
  }
}