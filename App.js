import { StatusBar } from 'expo-status-bar';
import { AttendenceAction, Home } from './screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { COLORS } from './constants';
const Stack = createNativeStackNavigator()
export default function App() {
  return (
    <NavigationContainer >
      <StatusBar style={
        'auto'
      } animated />
      <Stack.Navigator initialRouteName='home' >
        <Stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='Attendence action' component={AttendenceAction} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
