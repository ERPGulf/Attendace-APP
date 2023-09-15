import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../constants";

const TabStack = createBottomTabNavigator();

const HomeTabGroup = () => {
  return (
    <TabStack.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={32} color={color} />;
          }
          if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={32} color={color} />;
          }
          if (route.name === "chat") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
            return <Ionicons name={iconName} size={32} color={color} />;
          }
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 80,
          borderWidth: 0,
          paddingBottom: 25,
        },
      })}
    >
      <TabStack.Screen name="home" component={Home} />
      <TabStack.Screen name="chat" component={Home} />
      <TabStack.Screen name="profile" component={Home} />
    </TabStack.Navigator>
  );
};

export default HomeTabGroup;
