import { View, Text } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import { useSelector } from "react-redux";
const WelcomeCard = () => {
  const fullname = useSelector((state) => state.user.fullname);
  return (
    <View
      style={{ backgroundColor: COLORS.primary, width: "100%" }}
      className="h-60 rounded-2xl pt-3 px-4"
    >
      <View className="flex-row justify-center items-center mb-24">
        <Text className="text-3xl font-bold text-white">Login</Text>
      </View>
      <View>
        <Text className="text-xl font-semibold text-white">Hey,</Text>
        <View className="flex-row items-center space-x-2 mt-2">
          <Text
            numberOfLines={1}
            className="text-4xl font-semibold text-white max-w-xs"
          >
            {!fullname ? `Username` : fullname}
          </Text>
          <View className="bg-orange-400 w-10 h-10 items-center justify-center rounded-full">
            <Text className="text-3xl font-bold text-white">👋</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WelcomeCard;
