import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import React from "react";
import { AttendenceAction, AttendenceHistory, Home } from "../screens";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="Attendence action" component={AttendenceAction} />
      <Stack.Screen name="Attendence history" component={AttendenceHistory} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
