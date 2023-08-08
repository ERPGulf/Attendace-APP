import { AttendenceAction, Home, QrScan } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator()
export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName='QrScan' screenOptions={{ headerShown: false }} >
        <Stack.Screen name='home' component={Home} />
        <Stack.Screen name='Qrscan' component={QrScan} />
        <Stack.Screen name='Attendence action' component={AttendenceAction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
