import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const LavaMenu = () => {
  return (
    <View className="mt-2">
      <View>
        <Text className="text-sm font-semibold">Your Lava</Text>
      </View>
      <View className="my-2">
        <View
          className="flex-row justify-between items-center py-2.5 px-3 rounded-t-xl"
          style={{ width: "100%", backgroundColor: COLORS.primary }}
        >
          <TouchableOpacity>
            <Octicons name="people" size={SIZES.xxLarge + 4} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-white text-center ">
            Human Resources
          </Text>
          <TouchableOpacity className="bg-white justify-center items-center  rounded-lg">
            <AntDesign
              name="arrowright"
              size={SIZES.xxLarge + 4}
              color={COLORS.gray2}
            />
          </TouchableOpacity>
        </View>
        <View className="bg-white flex-row">
          <MaterialCommunityIcons
            name="calendar-multiple-check"
            size={SIZES.xxxLarge}
            color={COLORS.tertiary}
          />
        </View>
      </View>
    </View>
  );
};

export default LavaMenu;
