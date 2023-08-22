import { EventEmitter } from "events"

import CommandTemplateModel from "../../Models/CommandTemplateModel"

export default interface IVoiceManager {
  events: EventEmitter

  setup(templates: { [key: string]: CommandTemplateModel }): void
  startRecording(): Promise<unknown>
  stopRecording(): Promise<unknown>
}

export enum VoiceManagerEvents {
  onStartRecording = "onStartRecording",
  onStopRecording = "onStopRecording",
  onSpeechResults = "onSpeechResults",
  onSpeechError = "onSpeechError"
}

