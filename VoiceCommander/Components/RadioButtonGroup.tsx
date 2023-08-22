import * as React from 'react'
import { StyleProp, StyleSheet, View, Image, TouchableOpacity, Text, ViewStyle, ImageStyle } from 'react-native'

import { radio_button_on, radio_button_off } from '../Assets/Images'

interface IProps {
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  disabled: boolean
  options: string[]
  checked?: number
  onDidChange: (index: number) => void
}

interface IState {
  checked: number | undefined
}

export default class RadioButtonGroup extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {checked: props.checked}
  }

  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
      if (this.props.checked != prevProps.checked) {
        this.setState({checked: this.props.checked})
      }
  }

  public render() {
    const { containerStyle, imageStyle, disabled, options, onDidChange } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {options.map((option, index) => {
          return (
              <View key={index}>
                  {this.state.checked == index
                    ? <TouchableOpacity 
                        style={styles.btn} 
                        disabled={disabled}
                      >
                        <Image style={[styles.img, imageStyle, {opacity: disabled ? 0.5 : 1}]} source={radio_button_on}/>
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    : <TouchableOpacity style={styles.btn} disabled={disabled}
                        onPress={() => {
                          this.setState({ checked: index }, () => {
                            onDidChange(index)
                          })
                        }}
                      >
                        <Image style={[styles.img, imageStyle, {opacity: disabled ? 0.5 : 1}]} source={radio_button_off} />
                        <Text>{option}</Text>
                      </TouchableOpacity>
                  }
              </View>
          )
        })}
      </View>
    )
      
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 20
  },
  img: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  btn:{
    flexDirection: 'row',
  }
})
