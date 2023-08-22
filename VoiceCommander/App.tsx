/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { Appearance } from 'react-native'

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'

import ServiceFactory from './Services/ServiceFactory'
import AppViewModel from './AppViewModel'
import HomeScreen from './Scenes/Home/HomeScreen'

import * as copy from './Assets/Copy'

class App extends React.Component {
  private _serviceFactory = new ServiceFactory()
  private _viewModel = new AppViewModel(this._serviceFactory)

  public componentDidMount(): void {
    copy.configureMoment()
  }

  public render() {
    const colorScheme = Appearance.getColorScheme()
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
    return (
      <NavigationContainer theme={theme}>
        <HomeScreen viewModel={this._viewModel.homeViewModel()} theme={theme}/>
      </NavigationContainer>
    );
  } 
}

export default App;
