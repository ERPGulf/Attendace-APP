import { View, Text, Image } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import checkin from "../../assets/images/checkin.png";

const WelcomeCard = () => {
  return (
    <View
      style={{ width: "100%" }}
      className="px-4 py-4 bg-gray-100 rounded-xl"
    >
      <View
        style={{ backgroundColor: COLORS.primary, width: "100%" }}
        className="h-40 rounded-lg pt-3 px-4 w-full justify-center"
      >
        <View className="flex-row justify-between">
          <View className="w-8/12">
            <Text className="text-lg font-normal text-white">
              Welcome Back!
            </Text>
            <Text className="text-lg font-bold text-white">
              Check-In before you start working
            </Text>
          </View>
          <Image source={checkin} className="h-28 w-28" resizeMode="contain" />
        </View>
      </View>
      <Text className=" text-sm text-center pt-2 text-gray-500 font-medium">
        Last action:Check-out 22 May2023@10:40AM
      </Text>
    </View>
  );
};

export default WelcomeCard;
