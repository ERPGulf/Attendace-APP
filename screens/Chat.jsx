import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Chat = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Chat",
      headerTitleAlign: "center",
    });
  }, []);
  return (
    <View className="items-center justify-center flex-1">
      <Text>Coming soon!</Text>
    </View>
  );
};

export default Chat;
