import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Zocial } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.primary,
      }}
      className="px-3 relative items-center justify-end pb-4"
    >
      <View className="flex-row justify-center space-x-3 items-center absolute top-1/2 ">
        <Zocial name="logmein" size={SIZES.xxxLarge} color={"white"} />
        <Text className="text-3xl font-semibold text-white">
          Attendence App
        </Text>
      </View>
      <TouchableOpacity
        style={{ width: "100%" }}
        className="bg-white h-16 rounded-xl justify-center items-center"
        onPress={() => navigation.navigate("Qrscan")}
      >
        <Text
          className="text-2xl font-semibold"
          style={{ color: COLORS.primary }}
        >
          get started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
