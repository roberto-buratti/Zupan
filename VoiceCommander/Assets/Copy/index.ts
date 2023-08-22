import { findBestLanguageTag }  from 'react-native-localize'
//import I18n from 'react-native-i18n'
import moment from 'moment'
import 'moment/locale/en-gb'
import 'moment/locale/de'
import 'moment/locale/fr'
import 'moment/locale/it'
import 'moment/locale/pt'
import 'moment/locale/es'
import escapeRegexp from 'escape-string-regexp'

import _strings from './strings.json'

const copy: any = {
  ..._strings,
} 

export const weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]
export const monthNames = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

const languages = [
  ...Object.values(copy as { [key: string]: string })
  .map(Object.keys)
  .reduce(
    (accumulator: Set<string>, keys) => new Set([...accumulator, ...keys]),
    new Set<string>()
  ),
]
export const getSystemLanguage = () => {
  //console.log(`*** Copy:getSystemLanguage: currentLocale=${JSON.stringify(I18n.currentLocale())}`)
  //return I18n.currentLocale()
  return (findBestLanguageTag(languages)?.languageTag ?? 'en-gb')
}

export const configureMoment = () => {
  const systemLanguage = getSystemLanguage()
  moment.locale(systemLanguage)
}

export const getString = (key: string, replacements?: { [key: string]: string }) => {
  const systemLanguage = getSystemLanguage()
  let text: string | undefined = ((copy as any)[key] ?? {})[systemLanguage]
  if (text && replacements) {
    Object.keys(replacements)
    .forEach(replacementKey => {
      if (replacementKey.startsWith('$')) {
        text = text!.replace(new RegExp(escapeRegexp(replacementKey), 'g'), replacements[replacementKey])
      }
    })
  }
  return text != undefined ? text : `[missing:${key}(${systemLanguage})]`
}
