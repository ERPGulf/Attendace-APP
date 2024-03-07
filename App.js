import { Provider } from "react-redux";
import { store, persistor } from "./redux/Store";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Navigator from "./navigation/navigator";
import Toast from "react-native-toast-message";
import { PersistGate } from "redux-persist/integration/react";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { toastConfig } from "./Toast/Config";
import { SIZES } from "./constants";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

  if (!appReady) {
    return null;
  }
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <QueryClientProvider client={queryClient}>
          <Navigator />
          <StatusBar style="auto" />
          <Toast
            topOffset={
              Platform.OS === "ios" ? SIZES.topOffset + 55 : SIZES.topOffset
            }
            config={toastConfig}
          />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
