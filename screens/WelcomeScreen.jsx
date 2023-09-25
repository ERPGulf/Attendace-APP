import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import icon from "../assets/icon.png";

const WelcomeScreen = () => {
  const navigation = useNavigation();

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
        <Image source={icon} style={{ width: 50, height: 50 }} />
        <Text
          className="text-base font-semibold"
          style={{ color: COLORS.primary }}
        >
          Employee Self Service
        </Text>
      </View>
      <TouchableOpacity
        style={{ width: "100%", backgroundColor: COLORS.primary }}
        className="h-16 rounded-2xl justify-center items-center shadow-black shadow-lg"
        onPress={() => navigation.navigate("Qrscan")}
      >
        <Text className="text-xl font-semibold" style={{ color: "white" }}>
          GET STARTED
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
