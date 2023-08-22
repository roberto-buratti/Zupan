import * as copy from "../Assets/Copy"

export default class CommandModel {
  public id: string
  public name: string
  public label: string
  public value?: string
  
  constructor(id: unknown, name: string, label: string, value: string | undefined = undefined) {
    this.id = `${id}`
    this.name = name
    this.label = label
    this.value = value
  }

  public equals(rhs: CommandModel): boolean {
    return JSON.stringify(this) == JSON.stringify(rhs)
  } 
}