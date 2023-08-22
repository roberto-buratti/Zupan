type JSON = { [key: string]: string }

export default class CommandTemplateModel {
  private _name: string
  private _term: JSON
  private _action?: string

  public constructor(name: string, term: JSON, action?: string) {
    this._name = name
    this._term = term
    this._action = action
  }

  public get name() {
    return this._name
  }

  public term(language: string) {    
    return this._term[language] ?? this._term["en-gb"]
  }

  public get action() {
    return this._action
  }

}