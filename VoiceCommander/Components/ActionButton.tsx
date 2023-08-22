import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Animated, ImageSourcePropType, ViewStyle, ImageStyle, Text, ViewProps, TextStyle } from 'react-native'

import colors from '../Styles/Colors'

interface IActionButtonProps extends ViewProps {
  source?: ImageSourcePropType
  title?: string
  onPress: () => void
  onLongPress?: () => void
  style?: ViewStyle
  contentStyle?: ImageStyle | TextStyle
  disabled?: boolean
  pulse?: boolean
  badge?: string
}

interface IActionButtonState {
  fade: Animated.Value
}

export default class ActionButton extends React.Component<IActionButtonProps, IActionButtonState> {

  private pulseAnimation?: Animated.CompositeAnimation

  public constructor(props: IActionButtonProps) {
    super(props)
    this.state = {
      fade: new Animated.Value(0), // Initial value for fade pulsing: 0
    }
  }

  public componentDidMount() {
    const { pulse } = this.props
    if (pulse) {
      this.startPulse()
    } else {
      this.stopPulse()
    }
  }

  public componentDidUpdate(prevProps: IActionButtonProps) {
    if (this.props.pulse !== prevProps.pulse) {
      const { pulse } = this.props
      if (pulse) {
        this.startPulse()
      } else {
        this.stopPulse()
      }
    }
  }

  public componentWillUnmount() {
    this.stopPulse()
  }

  public render() {
    const { source, title, onPress, style, contentStyle, onLongPress, disabled } = this.props
    const opacity = (disabled ? 0.5 : 1.0)
    const { fade } = this.state


    // [ROB] It seems that TouchableOpacity always needs to have a child View component.
    // So a component that composes a View isn't enough.
    // This is why we add a simple <View> outside of the <Animated.View>.
    return (<TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      onLongPress={onLongPress}
      style={[style, { opacity }]}
    >
    <View>
      <Animated.View style={{ opacity: fade }}>
        {source && <Image source={source} style={[{tintColor: colors.zupan}, contentStyle as ImageStyle, { alignSelf: 'center' }]}/>}
        {title && <Text style={[contentStyle as TextStyle, { alignSelf: 'center'}]}>{title}</Text>}
        { this.props.children
          ? <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {this.props.children}
          </View>
          : null
        }
        { this.props.badge !== undefined        
          ? <Text style={styles.badge}>{this.props.badge}</Text>
          : null
        }
      </Animated.View>
    </View>
    </TouchableOpacity>)
  }

  private startPulse() {
    if (this.pulseAnimation !== undefined) {
      return
    }
    this.state.fade.setValue(0)
    this.pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.fade, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true
        }),
        Animated.timing(this.state.fade, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true
        }),
      ]),
      {
        iterations: -1, // default -1 for infinite
      })
    this.pulseAnimation!.start()
  }

  private stopPulse() {
    if (this.pulseAnimation !== undefined) {
      this.pulseAnimation.stop()
      this.pulseAnimation = undefined
    }
    this.state.fade.setValue(1)
  }

}

const styles = StyleSheet.create({
  badge: { 
    position: 'absolute',
    width: 18,
    height: 18,
    right: -25,
    top: -8,
    zIndex: 100,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'red',
    overflow: 'hidden',
    fontSize: 12
  }
})

