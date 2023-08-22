import React from 'react'
import { Theme } from '@react-navigation/native'
import { ScrollView, StyleSheet, Text, View, ViewStyle, Image, Alert, ActivityIndicator } from 'react-native'

import CommandModel from "../../Models/CommandModel"
import SpeechResultsModel from '../../Models/SpeechResultsModel'

import IVoiceCommanderViewModel, { IVoiceCommanderViewModelDelegate, IVoiceCommanderViewModelVisualCue } from "./IVoiceCommanderViewModel"

import ActionButton from "../../Components/ActionButton"
import CommandView from '../../Components/CommandView'

import padding from "../../Styles/Padding"
import colors from "../../Styles/Colors"
import * as copy from "../../Assets/Copy"
import { audio_wave } from '../../Assets/Images'

interface IProps {
  viewModel: IVoiceCommanderViewModel
  navigation: any
  theme: Theme
}

interface IState {
  isLoading: boolean,
  isRecording: boolean
  transcript: string
  current?: CommandModel
  commands: CommandModel[]
  visualCue?: IVoiceCommanderViewModelVisualCue
  error?: string
}

export default class VoiceCommanderScreen extends React.Component<IProps, IState> implements IVoiceCommanderViewModelDelegate {

  private _speechScrollView = React.createRef<ScrollView>()
  private _stackScrollView = React.createRef<ScrollView>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      isLoading: false,
      isRecording: false,
      transcript: "",
      commands: []
    }
  }

  public componentDidMount() {
    const { viewModel } = this.props
    viewModel.setup(this as IVoiceCommanderViewModelDelegate)
  }

  public render() {

    const { viewModel } = this.props
    const { isLoading, isRecording, transcript, current, commands, visualCue, error } = this.state
    const knownTerms = viewModel.knownTerms.join(", ")

    let lastCommandStyle: ViewStyle | null = null
    let currentCommandStyle: ViewStyle | null = null
    switch (visualCue) {
      case IVoiceCommanderViewModelVisualCue.CurrentCommandChanged:
        currentCommandStyle = { backgroundColor: 'yellow' }
        break
      case IVoiceCommanderViewModelVisualCue.CurrentCommandDeleted:
        currentCommandStyle = { backgroundColor: 'red' }
        break
      case IVoiceCommanderViewModelVisualCue.LastCommandDeleted:
        lastCommandStyle = { backgroundColor: 'red' }
        break
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{copy.getString("voice_commander_scene_welcome")}</Text>
        <Text style={styles.knownTerms}>{knownTerms}</Text>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={this._speechScrollView}
            // horizontal={true} 
            style={{ ...styles.scrollView }}
            contentContainerStyle={styles.speechContainer}
          >
            <Text style={styles.transcript}>{transcript}</Text>
          </ScrollView>
        </View>
        <CommandView command={current} style={[styles.currentCommand, currentCommandStyle]} />
        <View style={{ flex: 3 }}>
          <ScrollView
            ref={this._stackScrollView}
            style={{ ...styles.scrollView }}
            contentContainerStyle={styles.stackContainer}
          >
            {commands.map((command, index) => {
              return (
                <CommandView
                  key={index}
                  command={command}
                  style={[styles.stackCommand, index == commands.length - 1 ? lastCommandStyle : null]} />
              )
            })}
          </ScrollView>
        </View>
        <View style={{ flex: 0 }}>
          <Text style={{ marginVertical: 1, flex: 0, color: 'red' }}>{error}</Text>
        </View>
        <View style={styles.btnContainer}>
          {isLoading 
            ? <ActivityIndicator size="large" color={colors.zupan} />
            : <>
                {isRecording &&
                  <Image style={styles.wave} source={audio_wave}></Image>
                }
                <ActionButton
                  onPress={() => { viewModel.startRecording() }}
                  title={copy.getString("voice_commander_scene_start")}
                  disabled={isRecording || isLoading}
                  style={styles.action}
                  contentStyle={{ color: 'white' }}
                />
                <ActionButton
                  onPress={() => { viewModel.stopRecording() }}
                  title={copy.getString("voice_commander_scene_stop")}
                  disabled={!isRecording || isLoading}
                  style={styles.action}
                  contentStyle={{ color: 'white' }}
                />
            </>
          }
        </View>
      </View>
    )
  }

  // MARK: - IVoiceCommanderViewModelDelegate

  isLoading(status: boolean): void {
    this.setState({ isLoading: status })
  }

  isRecording(status: boolean): void {
    this.setState({ isRecording: status })
  }

  onSpeechResults(results: SpeechResultsModel, visualCue: IVoiceCommanderViewModelVisualCue): void {
    // console.log(`*** VoiceCommanderScreen:onSpeechResults: results=${JSON.stringify(results)} visualCue=${JSON.stringify(visualCue)} isRecording=${this.state.isRecording}`)
    this.setState({ visualCue, error: undefined }, () => {
      this._speechScrollView.current?.scrollToEnd({ animated: true })
      this._stackScrollView.current?.scrollToEnd({ animated: true })
      setTimeout(() => {
        this.setState({ visualCue: undefined }, () => {
          this.setState({
            transcript: results.transcript,
            commands: results.stack,
            current: results.current
          })
        })
      }, 300)
    })
  }

  onError(error: unknown) {
    console.log(`*** VoiceCommanderScreen:onError: error=${JSON.stringify(error)}`)
    // if (this.state.isRecording) {
    //   this.props.viewModel.stopRecording()
    // }
    const obj = error as Error
    const message = Object.keys(obj).includes("message") ? obj.message : `${obj}`
    if (message != this.state.error) {
      // [ROB] Alert is annoying on Android... too often.
      // Alert.alert(copy.getString("voice_commander_scene_title"), message)
      this.setState({ error: message })
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 24,
    gap: 20
  },
  welcome: {
    flex: 0,
    alignSelf: 'flex-start',
    marginVertical: 0,
  },
  knownTerms: {
    flex: 0,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginVertical: 0,
  },
  scrollView: {
    borderWidth: 1,
    borderColor: colors.veryLightGrey
  },
  speechContainer: {
    padding: 16,
  },
  stackContainer: {
    padding: 0,
  },
  transcript: {
    fontSize: 16
  },
  currentCommand: {
    minHeight: 80,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.veryLightGrey,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  stackCommand: {
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  wave: {
    paddingHorizontal: padding.onehalf,
    width: 100,
    height: 44,
    borderRadius: 8,
  },
  action: {
    paddingHorizontal: padding.onehalf,
    width: 100,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: colors.zupan,
    borderRadius: 8,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 24,
  },
});