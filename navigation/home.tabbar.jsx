import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Chat, Home, Profile } from '../screens';
import { COLORS } from '../constants';

const TabStack = createBottomTabNavigator();

function HomeTabGroup() {
  return (
    <TabStack.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          paddingBottom: 0,
          backgroundColor: 'white',
        },
      })}
    >
      <TabStack.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <TabStack.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'
              }
              size={30}
              color={color}
            />
          ),
        }}
      />
      <TabStack.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </TabStack.Navigator>
  );
}

export default HomeTabGroup;
