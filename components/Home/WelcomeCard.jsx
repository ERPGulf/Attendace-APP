import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
const WelcomeCard = () => {
  const fullname = useSelector((state) => state.user.fullname);
  return (
    <View
      style={{ backgroundColor: COLORS.primary, width: "100%" }}
      className="h-48 rounded-2xl p-3 justify-between"
    >
      <View className="flex-row justify-center items-center relative h-14">
        <TouchableOpacity className="bg-orange-400 w-12 h-12 items-center justify-center rounded-full absolute right-1 top-1">
          <MaterialCommunityIcons
            name="bell"
            color={COLORS.white}
            size={SIZES.xxLarge}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Home</Text>
      </View>
      <View>
        <Text className="text-base font-medium text-white">Welcome,</Text>
        <View className="flex-row items-center space-x-2 -mt-1">
          <Text
            numberOfLines={1}
            style={{ maxWidth: 260 }}
            className="text-3xl font-semibold text-white"
          >
            {!fullname ? `username` : fullname}
          </Text>
          <View className="bg-orange-400 w-10 h-10 items-center justify-center rounded-full">
            <Text className="text-3xl">👋</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WelcomeCard;
