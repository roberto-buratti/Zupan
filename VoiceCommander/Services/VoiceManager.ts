import Voice, { SpeechStartEvent, SpeechEndEvent, SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice'
import { EventEmitter } from "events"

import CommandTemplateModel from '../Models/CommandTemplateModel'
import CommandModel from '../Models/CommandModel'
import SpeechResultsModel from '../Models/SpeechResultsModel'

import IVoiceManager, { VoiceManagerEvents } from "./Interfaces/IVoiceManager"

import * as copy from "../Assets/Copy"
import { Platform } from 'react-native'

export enum VoiceManagerStatus {
  Off,
  On
}

export default class VoiceManager implements IVoiceManager {
  private static _shared: IVoiceManager = new VoiceManager()

  private _events: EventEmitter = new EventEmitter()
  private _language: string
  private _status: VoiceManagerStatus
  private _options: { [key: string]: any }
  private _templates: CommandTemplateModel[] = []
  private _validChars: string
  private _voiceDigits: string[]
  private _transcript: string = ""
  private _lastCommand?: CommandModel
  private _currentCommand?: CommandModel
  private _stack: CommandModel[] = []

  public static get shared(): IVoiceManager {
    return this._shared
  }

  public get events(): EventEmitter {
    return this._events
  }

  public constructor() {
    // [ROB]: subscribe this on changes!
    this._language = copy.getSystemLanguage()
    this._validChars = copy.getString("voice_valid_chars")
    this._voiceDigits = copy.getString("voice_digits").split("|")
    // [ROB]: END subscribe this on changes!

    this._status = VoiceManagerStatus.Off

    Voice.onSpeechStart = this._onSpeechStart.bind(this)
    Voice.onSpeechEnd = this._onSpeechEnd.bind(this)
    Voice.onSpeechError = this._onSpeechError.bind(this)
    // Voice.onSpeechPartialResults = this._onSpeechPartialResults.bind(this)
    Voice.onSpeechResults = this._onSpeechResults.bind(this)

    this._options = Platform.OS == "android"
      ? {
        RECOGNIZER_ENGINE: "GOOGLE",
        EXTRA_LANGUAGE_MODEL: "LANGUAGE_MODEL_FREE_FORM",
        EXTRA_MAX_RESULTS: 1
      }
      : {

      }
  }

  setup(templates: { [key: string]: CommandTemplateModel }): void {
    this._templates = Object.values(templates)
  }

  public async startRecording() {
    if (this._status == VoiceManagerStatus.On) {
      return
    }
    this._status = VoiceManagerStatus.On
    this._events.emit(VoiceManagerEvents.onStartRecording, undefined)
    this._transcript = ""
    this._stack = []
    this._currentCommand = undefined
    try {
      //console.log(`*** VoiceManager:startRecording: Voice.start=${JSON.stringify(Voice.start)}`)
      const isAvailable = await Voice.isAvailable()
      console.log(`*** VoiceManager:startRecording: isAvailable=${isAvailable}`)
      await Voice.start(this._language, this._options)
      let results = new SpeechResultsModel(this._transcript, [...this._stack], this._currentCommand, this._lastCommand)
      this._events.emit(VoiceManagerEvents.onSpeechResults, results)
    } catch (error) {
      this._events.emit(VoiceManagerEvents.onSpeechError, error)
    }
  }

  public async stopRecording() {
    console.log(`*** VoiceManager:stopRecording: status=${this._status}`)
    if (this._status == VoiceManagerStatus.Off) {
      return
    }
    this._status = VoiceManagerStatus.Off
    try {
      await Voice.stop()
      await Voice.destroy()
      if (this._currentCommand) {
        this._stack.push(this._currentCommand)
        this._currentCommand = undefined
      }
      let results = new SpeechResultsModel(this._transcript, [...this._stack], this._currentCommand, this._lastCommand)
      this._events.emit(VoiceManagerEvents.onSpeechResults, results)
      this._events.emit(VoiceManagerEvents.onStopRecording, undefined)
      console.log(`*** VoiceManager:stopRecording: status=${this._status}`)
    } catch (error) {
      this._events.emit(VoiceManagerEvents.onSpeechError, error)
    }
  }

  // MARK: - Private

  private _onSpeechStart(event: SpeechStartEvent) {
    // console.log(`*** VoiceManager:onSpeechStart: event=${JSON.stringify(event)}`)
  }

  private _onSpeechEnd(event: SpeechEndEvent) {
    // console.log(`*** VoiceManager:onSpeechEnd: event=${JSON.stringify(event)}`)
    // if (this._status == VoiceManagerStatus.On) {
    //   this._restart()
    // }
  }

  private _onSpeechError(event: SpeechErrorEvent) {
    // console.log(`*** VoiceManager:onSpeechError: event=${JSON.stringify(event)}`)
    this._events.emit(VoiceManagerEvents.onSpeechError, event.error)
  }

  // private async _onSpeechPartialResults(event: SpeechResultsEvent) {
  //   console.log(`*** VoiceManager:onSpeechPartialResults: event=${JSON.stringify(event)}`)
  // }

  private async _onSpeechResults(event: SpeechResultsEvent) {
    console.log(`*** VoiceManager:onSpeechResults: event=${JSON.stringify(event)}`)
    if (this._status == VoiceManagerStatus.Off) {
      return
    }
    const text = (event.value ?? [""])[0]
    if (Platform.OS == "ios") {
      this._transcript = (event.value ?? [""])[0]
    } else {
      this._transcript = (this._transcript + " " + (event.value ?? [""])[0]).trim()
    }
    const tokens = this._clean(this._transcript)
    if (tokens.length == 0) {
      return
    }
    this._parseCommands(tokens)

    let results = new SpeechResultsModel(this._transcript, [...this._stack], this._currentCommand, this._lastCommand)
    this._events.emit(VoiceManagerEvents.onSpeechResults, results)
  }

  private _parseCommands(tokens: string[]): void {
    this._stack = []
    this._currentCommand = undefined
    let i = 0
    while (i < tokens.length) {
      const token = tokens[i]
      if (this._isCommand(token)) {
        const template = this._templates.find(t => t.term(this._language) == token)
        let command = new CommandModel(this._stack.length, template!.name, token) // [ROB] pardon the force-unwrap, but here we are sure that command != undefined
        this._lastCommand = command
        if (!this._processCommand(command)) {
          if (this._currentCommand) {
            this._stack.push(this._currentCommand)
          }
          this._currentCommand = command
        }
        i = this._parseParam(tokens, i + 1)
      }
      i++
    }
  }

  private _isCommand(token: string): boolean {
    const template = this._templates.find(t => t.term(this._language) == token)
    return template != undefined
  }

  private _parseParam(tokens: string[], startAt: number): number {
    // [ROB] this is subtle: 
    // _parseCommands() will always increment `i' by 1 after having called _parseParam()
    // This is why here we have to return (startAt - 1) now or (i -1) after the loop.
    // May be it could have been made better, but this quick & dirty works fine.
    if (this._currentCommand == undefined) {
      return startAt - 1
    }
    let param = ""
    let i = startAt
    while (i < tokens.length) {
      const token = tokens[i]
      if (this._isCommand(token)) {
        break
      }
      const isNumeric = /^\d+$/.test(token)
      if (isNumeric) {
        param += token
      }
      i++
    }
    if (param.length > 0) {
      this._currentCommand.value = param
      this._lastCommand = undefined // [ROB] the last token is a param, not a command
    }
    return i - 1
  }

  private _clean(strings: string): string[] {
    if (strings.length == 0) {
      return []
    }
    let string = strings.toLocaleLowerCase().trim()
    // console.log(`*** VoiceManager:_clean: string=${JSON.stringify(string)}`)
    // [ROB] clear non-alphanumeric chars (for example, if you say "7 15", you get back "7:15" 😡)
    for (let i = string.length - 1; i >= 0; i--) {
      if (!this._isValid(string.charAt(i))) {
        string = string.slice(0, i) + string.slice(i + 1)
      }
    }

    let tokens = string.split(" ")

    // [ROB] replace one, two, three... with 1, 2, 3...
    for (let i = tokens.length - 1; i >= 0; i--) {
      tokens[i] = this._replaceDigits(tokens[i])
    }
    return tokens
  }

  private _processCommand(command: CommandModel): boolean {
    const template = this._templates.find(t => t.name == command.name)
    if (!template) {
      return false
    }
    const action = template.action
    switch (action) {
      case "back":
        // [ROB] just delete the last command.
        // IMHO it is easier to say "back" twice than re-entering a long barcode as if I pop the last pair (code/quantity)
        if (this._currentCommand) {
          this._currentCommand = undefined
        } else {
          this._stack.pop()
        }
        return true
      case "clear":
        // [ROB] Luis Resco said: "if you are enumerating a long barcode counting like "one two three" and you want to start over 
        // you can use Reset command to cancel the current"
        if (this._currentCommand) {
          this._currentCommand.value = undefined
        }
        return true
      case "stop":
        this.stopRecording()
        return true
    }
    return false
  }

  private _isValid(char: string) {
    const regexp = new RegExp(this._validChars)
    return char.length == 1 && regexp.test(char)
  }

  private _replaceDigits(text: string): string {
    let result = text
    for (let i = 0; i < this._voiceDigits.length; i++) {
      result = result.replace(this._voiceDigits[i], `${i}`)
    }
    return result.trim()
  }

  private async _restart() {
    await Voice.stop()
    await Voice.start(this._language, this._options)
  }

}