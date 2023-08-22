import { StyleSheet, StyleProp, ViewStyle } from 'react-native'

import colors from './Colors'
import padding from './Padding'

type Style = StyleProp<ViewStyle>
interface IShadowStylesProps {
  shadow: Style
  invertedShadow: Style
}
interface IShadowStyleObjects {
  shadowObject: ViewStyle
  invertedShadowObject: ViewStyle
}
interface IShadowStyles extends IShadowStyleObjects, IShadowStylesProps {}

const shadowBase: ViewStyle = {
  elevation: 2,
  shadowColor: colors.shadow,
  shadowOpacity: 0.12,
  shadowRadius: padding.half,
}

const objects: IShadowStyleObjects = {
  shadowObject: {
    ...shadowBase,
    shadowOffset: { width: 0, height: padding.half },
  },
  invertedShadowObject: {
    ...shadowBase,
    shadowOffset: { width: 0, height: -padding.quarter },
  },
}

const renamedObjects = Object.keys(objects)
.reduce((o, key) => {
  o[key.replace('Object', '')] = (objects as any)[key]
  return o
}, {} as any)
const styles = StyleSheet.create(renamedObjects)

const shadows: IShadowStyles = {...objects, ...styles}

export default shadows
