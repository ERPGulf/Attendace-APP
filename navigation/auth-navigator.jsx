import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';
import { Login, QrScan, WelcomeScreen } from '../screens';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="Qrscan" component={QrScan} />
      <Stack.Screen name="welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
