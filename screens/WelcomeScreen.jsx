import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import icon from "../assets/icon.png";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.white,
      }}
      className="px-3 relative items-center justify-center pb-4"
    >
      <View className=" justify-center space-x-3 items-center">
        <Image source={icon} style={{ width: 150, height: 150 }} />
        <Text className="text-sm font-normal text-gray-400 mt-2">
          ESS by ERPGULF
        </Text>
      </View>
      <TouchableOpacity
        style={{ width: "100%", borderWidth: 2, borderColor: COLORS.primary }}
        className="h-16 rounded-2xl justify-center items-center absolute bottom-5"
        onPress={() => navigation.navigate("Qrscan")}
      >
        <Text
          className="text-xl font-semibold"
          style={{ color: COLORS.primary }}
        >
          GET STARTED
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
