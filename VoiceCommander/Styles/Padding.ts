
import { NativeModules, Platform } from 'react-native'

const { StatusBarManager } = NativeModules

const padding = 18

export default {
  statusbar: Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT,
  quarter: padding / 4,
  half: padding / 2,
  threequarters: 3 * padding / 4,
  full: padding,
  onehalf: padding * (3 / 2),
  double: padding * 2,
  triple: padding * 3,
  text: padding / 2,
}
