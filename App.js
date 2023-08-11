import { Provider } from 'react-redux';
import { store } from './redux/Store';
import { StatusBar } from 'expo-status-bar';
import Navigator from './navigation/navigator';
import Toast from "react-native-toast-message";
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
export default function App() {

  return (
    <Provider store={store}>
      <Suspense fallback={
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={'large'} />
        </View>
      }>
        <Navigator />
        <StatusBar style='auto' />
        <Toast />
      </Suspense>
    </Provider>
  );
}
