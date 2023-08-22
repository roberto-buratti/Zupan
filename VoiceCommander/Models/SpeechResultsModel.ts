import CommandModel from "./CommandModel"

export default class SpeechResultsModel {
  public transcript: string
  public stack: CommandModel[]
  public current?: CommandModel
  public last?: CommandModel
  
  constructor(transcript: string, stack?: CommandModel[], current?: CommandModel, last?: CommandModel) {
    this.transcript = transcript
    this.stack = stack ?? []
    this.current = current
    this.last = last
  }
}