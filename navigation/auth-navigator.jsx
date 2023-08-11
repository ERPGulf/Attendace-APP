import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login, QrScan, WelcomeScreen } from "../screens";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/Store";
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Provider store={store}>
      <Stack.Navigator
        initialRouteName="welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="Qrscan" component={QrScan} />
        <Stack.Screen name="welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </Provider>
  );
};

export default AuthNavigator;
