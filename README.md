# Zupan
## Mobile Coding Exercise

### General Description

The app has been implemented using react-native and tested on iOS & Android (on physical devices).

The hardest part of the job has been making it work even on Android (See `Known Issues` later).

The app has been implement using the **MVVM** design pattern, so each page delegates all the business logic to its `viewModel`.

The `viewModel` is always declared as an interface and is injected from outside, so every scene is unit-testable. I'm aware that it was not requested but this is the way I normally work.

I reused somewhere code I wrote for other apps but most of the code if fresh new.  
What is not new is the app architecture, since I always use the same design patterns (...when I can choose).

There are 4 important services that implement the interaction with the server:

1. `ServiceFactory` 

It is just responsible for the creation of and the access to the `ServiceManager` (or other global managers, for example, `VoiceManager`).  
It is created at the launch and it is injected in every view model (as an interface).

2. `ServiceManager`

It is the global Facade that implements all the remote services the app needs to call. 

> Just one, in this case:  
> `getConfig(): Promise<ConfigModel>`. 

Every view model that needs to interact with the server can get the instance of the service manager from the (injected) service factory.

Both `ServiceFactory` & `ServiceManager` are always declared as interfaces (in the name of unit-testing).

`ServiceManager` is normally a singleton but this is not mandatory.  
It should be used ***exclusively*** by view models, never by views or models.

3. `NetworkManager`. 

It is just responsible for actually doing the calls via http.  
It doesn't know anything about models and data structures used by the app.  
It just knows about HTTP, REST, status codes etc...  
It handles timeout and validates the status code of the response.

It has not been declared as an interface because it must be used ***solely*** by the `ServiceManager` (if you need to mock the service manager for testing purpouses, you won't need to access the network manager).

4. `VoiceManager`.

It is responsible for wrapping and managing `@react-native-voice/voice`.

It exposes just 3 methods (`setup()`, `startRecording()`, `stopRecording()`) and publishes events to any listener when results are available or errors occur.

The `setup()` method is used to inject knowledge about the known terms.
This info should be obtained by the server (via `ServiceManager.getConfig()`). 
At the moment, it is hardcoded in the file `config.json` for the sake of simplicity. 
You can modify it adding/removing/changing terms.

Each term may have an associated `action`. 
The recognized actions are:

- `back`: it pops last command
- `clear`: it clears the params from the current command
- `stop`: it stops recording

Trying to passing a configuration with different actions, will show en error to the user, on invocation.

Like `ServiceFactory` & `ServiceManager`, `VoiceManager` is declared as an interface.

***CAVE:*** on iOS, speech recognition behaves somelike different than Android. In particular, is you say *"one, two, three"*, you get the transcript *"123"*. For the scope of this exercise, it seemed too hard to distinguish "*"one, two, three"* from *"onehundredtwentythree"*, so I decided NOT to respect the rule that states to accept only digits.

### Screens & Use cases

The app support localization for 6 languages: `en`, `it`, `fr`, `de`, `es`, `pr`.  
If a different system language is detected, `en` is used by default.  
At the moment, translations are available just for `en` & `it`.
Even the configuration file has command translation just for `en` & `it`.

You can add translations modifying the file `strings.json` (for the interface) or `config.json` (for the commands).

The app has just one screen: 

- `Voice Commander`: The main interface. 

#### Voice Commander

It presents (from top to bottom):

- A welcome text with the instructions to run and the list of known terms (got from `ServiceManager``)
- A text view containg the speech transcript.
- A view with the *current* command.
- A scrollview with all the other commands recognized so far.
- 2 buttons to start/stop the speech recognition and an animated GIF showing the recording status.

The GUI is really simple, no bells and whistles, I focused just on make it work.

***Important***: The server call to get the commands configuration is mocked, so it is really fast (obviously, since it is mocked!). I added 1000ms delay just to let the user see the visual effects. An activity indicator is shown while refreshing and all the interactors are disabled.

### Notes

Any tappable interactor has tintColor '#173660' (like zupan.com).

Inside the code, relevant comments are marked with a leading  
`// [ROB]`

### Known Issues

> @react-native-voice/voice DOESN'T work on Android: it stops after the first result and it seems there is no way to overcome this problem. 
I spent a lot of time googling but at the end -**after 3 days of fruitless attempts**- I've had to patch it to make it recognize continuosly.
The patch is located in the `\...\patches` directory and `yarn` is configured to apply it after installation, so no intervention is required.

> Animated GIFs don't work on RN/Android. I added `com.facebook.fresco`, it seemed to me the easiest way (see: https://stackoverflow.com/questions/35594783/how-do-i-display-an-animated-gif-in-react-native).

> react-native-reanimated@3.4.1 causes the app to crash. I downgraded it to 3.3.0
(see: https://github.com/software-mansion/react-native-reanimated/issues/4836).

