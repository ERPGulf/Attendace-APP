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
          paddingBottom: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          elevation: 5,
        },
      })}
    >
      <TabStack.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name={"home"} size={30} color={color} />
          ),
        }}
      />
      <TabStack.Screen
        name="chat"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"message1"} size={30} color={color} />
          ),
        }}
      />
      <TabStack.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"user"} size={30} color={color} />
          ),
        }}
      />
    </TabStack.Navigator>
  );
};

export default HomeTabGroup;
