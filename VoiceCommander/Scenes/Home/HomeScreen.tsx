import React from 'react'

import { Theme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import IHomeViewModel from './IHomeViewModel'

import VoiceCommanderScreen from '../VoiceCommander/VoiceCommanderScreen'

import * as copy from '../../Assets/Copy'

interface IProps {
  viewModel: IHomeViewModel
  theme: Theme
}

interface IState {
}

const MainStack = createNativeStackNavigator();

export default class HomeScreen extends React.Component<IProps, IState> {

  public render() {

    const { viewModel, theme } = this.props

    function VoiceCommanderScreenComponent({ route, navigation }) {
      return <VoiceCommanderScreen viewModel={viewModel.voiceCommanderViewModel()} navigation={navigation} theme={theme}/>
    }

    return (
      <MainStack.Navigator screenOptions={
        {
          orientation: 'portrait',    // [ROB] disable landscape because the effect isn't pleasant
          headerBackTitleVisible: false,         
          navigationBarColor: 'black'
        }}
      >
        <MainStack.Screen
          name={"hotels_scene"}
          component={VoiceCommanderScreenComponent}
          options={{ title: copy.getString("voice_commander_scene_title") }}
        />
      </MainStack.Navigator>
    )
  }
}
