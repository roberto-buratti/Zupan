package com.voicecommander;

import android.app.Application;
//import com.facebook.react.PackageList;
import com.voicecommander.missingreactpackage.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          final Application app = getApplication();
          List<ReactPackage> packages = new PackageList(app).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(new com.swmansion.rnscreens.RNScreensPackage());
            //My Metro told me that RNGestureHandlerPackage is created twice, hence I comment the line, and then everything works.
            // packages.add(new com.swmansion.gesturehandler.RNGestureHandlerPackage());
            packages.add(new com.th3rdwave.safeareacontext.SafeAreaContextPackage());
            packages.add(new com.swmansion.reanimated.ReanimatedPackage());
            packages.add(new com.zoontek.rnlocalize.RNLocalizePackage());
            packages.add(new com.wenkesj.voice.VoicePackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
