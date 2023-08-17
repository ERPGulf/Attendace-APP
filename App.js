import { Provider } from 'react-redux';
import { store, persistor } from './redux/Store';
import { StatusBar } from 'expo-status-bar';
import Navigator from './navigation/navigator';
import Toast from "react-native-toast-message";
import { ActivityIndicator, View } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Suspense } from 'react';
export default function App() {

  return (
    <Suspense fallback={<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} ><ActivityIndicator size={"large"} /></View>
    }>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} ><ActivityIndicator size={"large"} /></View>}>
          <Navigator />
          <StatusBar style='auto' />
          <Toast />
        </PersistGate>
      </Provider>
    </Suspense >
  );
}
