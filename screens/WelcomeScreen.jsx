import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import icon from "../assets/icon.png";
import Ionicons from "@expo/vector-icons/Ionicons";

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
        <Image source={icon} style={{ width: 250, height: 250 }} />
       
      </View>
      <TouchableOpacity
        style={{ width: "100%", borderWidth: 2, borderColor: COLORS.primary }}
        className="h-16 rounded-2xl justify-center items-center absolute bottom-5"
        onPress={() => navigation.navigate("Qrscan")}
      >
        <View
          style={{ width: "100%" }}
          className="h-full rounded-2xl justify-center items-center relative
          flex-row"
        >
          <Text
            className="text-xl font-semibold text-center"
            style={{ color: COLORS.primary }}
          >
            GET STARTED
          </Text>
          <View className="absolute right-5">
            <Ionicons
              name="ios-arrow-forward"
              size={38}
              color={COLORS.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
