import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile } from "../screens";
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLORS } from "../constants";

const TabStack = createBottomTabNavigator();

const HomeTabGroup = () => {
  return (
    <TabStack.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 80,
          borderWidth: 0,
          paddingBottom: 0,
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: 20,
          elevation: 5,
        },
      })}
    >
      <TabStack.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"home"} size={34} color={color} />
          ),
        }}
      />
      <TabStack.Screen
        name="chat"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"message1"} size={34} color={color} />
          ),
        }}
      />
      <TabStack.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"user"} size={34} color={color} />
          ),
        }}
      />
    </TabStack.Navigator>
  );
};

export default HomeTabGroup;
