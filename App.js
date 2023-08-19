import { Provider } from 'react-redux';
import { store, persistor } from './redux/Store';
import { StatusBar } from 'expo-status-bar';
import Navigator from './navigation/navigator';
import Toast from "react-native-toast-message";
import { PersistGate } from 'redux-persist/integration/react';
import { useState } from 'react';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons'

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default function App() {
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        SplashScreen.preventAutoHideAsync()
        const IconAssets = cacheFonts([Ionicons.font])
        await Promise.all([...IconAssets])
      } catch (error) {
        console.warn(error)
      } finally {
        setAppReady(true)
        SplashScreen.hideAsync()
      }
    }
  }, [])
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Navigator />
        <StatusBar style='auto' />
        <Toast />
      </PersistGate>
    </Provider>
  );
}
