import * as React from 'react'
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native'

import CommandModel from '../Models/CommandModel'

interface IProps {
  command?: CommandModel
  style?: StyleProp<ViewStyle>
}

interface IState {

}

export default class CommandView extends React.Component<IProps, IState> {
  public render(): React.ReactNode {
    const { command, style } = this.props

    return (
      <View style={[(style ?? {}), styles.container]}>
        <Text style={styles.label}>{command?.label}</Text>
        <Text style={styles.value}>{command?.value}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 20,
    fontWeight: "bold"
  },
  value: {
    fontSize: 20
  }
})

