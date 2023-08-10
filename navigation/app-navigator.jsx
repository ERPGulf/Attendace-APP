import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import React from "react";
import { AttendenceAction, Home } from "../screens";
import { Provider } from "react-redux";
import { store } from "../redux/Store";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="Attendence action" component={AttendenceAction} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
