import CommandTemplateModel from "./CommandTemplateModel"

export default class ConfigModel {
  private _commands: { [key: string]: CommandTemplateModel }

  public constructor(config: { [key: string]: any }) {
    // const templates = config.commands as { [key: string]: any }
    // const keys = [...Object.values(templates)
    //   .map(Object.keys)
    //   .reduce(
    //     (accumulator: Set<string>, value) => new Set([...accumulator, ...value]),
    //     new Set<string>())]

    const templates = config.commands as { [key: string]: any }
    this._commands = {}
    for (let key in templates) {
      const template = templates[key]
      this._commands[key] = new CommandTemplateModel(key, template.term, template.action)
    }
  }

  public get commands() {
    return this._commands
  }
}