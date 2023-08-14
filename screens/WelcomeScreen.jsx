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
        backgroundColor: COLORS.white,
      }}
      className="px-3 relative items-center justify-end pb-4"
    >
      <View className="flex-row justify-center space-x-3 items-center absolute top-1/2 ">
        <Zocial name="logmein" size={SIZES.xxxLarge} color={COLORS.primary} />
        <Text
          className="text-3xl font-semibold"
          style={{ color: COLORS.primary }}
        >
          Attendence App
        </Text>
      </View>
      <TouchableOpacity
        style={{ width: "100%", backgroundColor: COLORS.primary }}
        className="h-16 rounded-2xl justify-center items-center shadow-black shadow-lg"
        onPress={() => navigation.navigate("Qrscan")}
      >
        <Text className="text-2xl font-semibold" style={{ color: "white" }}>
          GET STARTED
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
