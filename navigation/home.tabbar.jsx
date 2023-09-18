import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile } from "../screens";
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLORS } from "../constants";

const TabStack = createBottomTabNavigator();

const HomeTabGroup = () => {
  return (
    <TabStack.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarIcon: ({ color }) => {
          if (route.name === "home") {
           
            return <AntDesign name={'home'} size={34} color={color} />;
          }
          if (route.name === "chat") {
            return <AntDesign name={'message1'} size={34} color={color} />;
          }
          if (route.name === "profile") {
            return <AntDesign name={'user'} size={34} color={color} />;
          }
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 80,
          borderWidth: 0,
          paddingBottom: 0,
          bottom:10,
          left: 10,
          right: 10,
          borderRadius: 20,
          elevation:5,
        },
      })}
    >
      <TabStack.Screen name="home" component={Home}/>
      <TabStack.Screen name="chat" component={Home} />
      <TabStack.Screen name="profile" component={Profile} />
    </TabStack.Navigator>
  );
};

export default HomeTabGroup;
