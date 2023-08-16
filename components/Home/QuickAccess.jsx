import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const QuickAccess = () => {
  return (
    <View className="mt-4 w-full">
      <View className="flex-row justify-between items-center ">
        <Text className="text-sm font-semibold">Quick Access</Text>
        <TouchableOpacity className="flex-row space-x-2 items-center">
          <Text className="text-sm font-semibold" style={{ color: COLORS.red }}>
            Add New
          </Text>
          <FontAwesome name="plus" size={SIZES.xLarge} color={COLORS.red} />
        </TouchableOpacity>
      </View>
      <View className="px-0.5">
        <View
          style={{
            borderRadius: Platform.OS === "android" ? 0 : "12px",
          }}
          className="border-dashed bg-white border-red-900 border-2 h-40 items-center justify-center mt-2"
        >
          <TouchableOpacity className="items-center justify-center ">
            <AntDesign
              name="addfile"
              size={SIZES.xxxLarge - 4}
              color={COLORS.red}
            />
            <Text className="text-xs mt-2 font-light text-gray-800">
              Add quick shortcuts to your most used features
            </Text>
            <Text className="text-xs font-light text-gray-800">
              here to access them quickly
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default QuickAccess;
