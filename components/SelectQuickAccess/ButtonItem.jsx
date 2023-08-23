import { View, Text } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";

const ButtonItem = ({ iconName, text1, text2 }) => {
  return (
    <View>
      <View className="bg-gray-100 p-2 flex-row justify-center items-center rounded-lg w-16">
        <Ionicons
          name={iconName}
          size={SIZES.xxxLarge - 3}
          color={COLORS.tertiary}
        />
      </View>
      {text1 && (
        <Text className="text-xs text-center font-medium text-gray-500 mt-1">
          {text1}
        </Text>
      )}
      {text2 && (
        <Text className="text-xs text-center font-medium text-gray-500">
          {text2}
        </Text>
      )}
    </View>
  );
};

export default ButtonItem;
