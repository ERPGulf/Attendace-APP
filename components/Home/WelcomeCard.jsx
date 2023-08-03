import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const WelcomeCard = () => {
  return (
    <View
      style={{ backgroundColor: COLORS.primary, width: "100%" }}
      className="h-48 rounded-2xl pt-3 px-4 "
    >
      <View className="flex-row justify-between items-center mb-14">
        <TouchableOpacity className="bg-orange-400 w-12 h-12 items-center justify-center rounded-full">
          <MaterialCommunityIcons
            name="bell"
            color={COLORS.white}
            size={SIZES.xxLarge}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Home</Text>
        <TouchableOpacity className="bg-orange-400 w-12 h-12 items-center justify-center rounded-full">
          <Ionicons
            name="ios-settings-sharp"
            color={COLORS.white}
            size={SIZES.xxLarge}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text className="text-lg font-semibold text-white">Welcome,</Text>
        <View className="flex-row items-center space-x-2 -mt-1">
          <Text
            numberOfLines={1}
            className="text-2xl font-semibold text-white max-w-xs"
          >
            Rishal Bazim
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
