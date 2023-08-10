import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import { StatusBar } from 'expo-status-bar';
import Navigator from './navigation/navigator';
export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
      <StatusBar style='auto' />
      {/* <NavigationContainer >
        <Stack.Navigator initialRouteName='login' screenOptions={{ headerShown: false }} >
          <Stack.Screen name='home' component={Home} />
          <Stack.Screen name='Qrscan' component={QrScan} />
          <Stack.Screen name='Attendence action' component={AttendenceAction} />
          <Stack.Screen name='login' component={Login} />
        </Stack.Navigator>
      </NavigationContainer> */}
    </Provider>
  );
}
