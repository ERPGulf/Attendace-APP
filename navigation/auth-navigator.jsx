import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login, QrScan } from "../screens";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/Store";
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Provider store={store}>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="Qrscan" component={QrScan} />
      </Stack.Navigator>
    </Provider>
  );
};

export default AuthNavigator;
