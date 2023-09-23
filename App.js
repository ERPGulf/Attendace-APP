import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Navigator from "./navigation/navigator";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from "react-native-toast-message";
import { PersistGate } from "redux-persist/integration/react";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Ionicons from "@expo/vector-icons/Ionicons";

function cacheFonts(fonts) {
  return fonts.map((font) => Font.loadAsync(font));
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        SplashScreen.preventAutoHideAsync();
        const IconAssets = cacheFonts([Ionicons.font]);
        await Promise.all([...IconAssets]);
      } catch (error) {
        console.warn(error);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    };
    loadResourcesAndDataAsync();
  }, []);
  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          backgroundColor: "#00D100",
          borderLeftColor: "#00D100",
          borderRadius: 30,
        }}
        text1Style={{
          fontSize: 18,
          color: "#fff",
          textAlign: "center",
        }}
        text2Style={{
          fontSize: 8,
          color: "#fff",
          textAlign: "center",
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: "#FF4B2E",
          borderLeftColor: "#FF4B2E",
          borderRadius: 30,
        }}
        text1Style={{
          fontSize: 18,
          color: "#fff",
          textAlign: "center",
        }}
        text2Style={{
          fontSize: 8,
          color: "#fff",
          textAlign: "center",
        }}
      />
    ),
    info: (props) => (
      <InfoToast
        {...props}
        style={{
          backgroundColor: "#0096FF",
          borderLeftColor: "#0096FF",
          borderRadius: 30,
        }}
        text1Style={{
          fontSize: 18,
          color: "#fff",
          textAlign: "center",
        }}
        text2Style={{
          fontSize: 8,
          color: "#fff",
          textAlign: "center",
        }}
      />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  if (!appReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Navigator />
        <StatusBar style="auto" />
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
}
