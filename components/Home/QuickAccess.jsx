import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const QuickAccess = () => {
  return (
    <View style={{ width: "100%" }} className="mt-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-semibold">Quick Access</Text>
        <TouchableOpacity className="flex-row space-x-2 items-center">
          <Text className="text-sm font-semibold" style={{ color: COLORS.red }}>
            Add New
          </Text>
          <FontAwesome name="plus" size={24} color={COLORS.red} />
        </TouchableOpacity>
      </View>
      <View className="border-dashed border-gray-500 border-2 rounded-xl h-40 items-center justify-center mt-2">
        <AntDesign
          name="addfile"
          size={SIZES.xxxLarge - 4}
          color={COLORS.red}
        />
        <Text className="text-xs mt-2 font-light text-gray-800">
          Add quick shortcuts to yourmost used features
        </Text>
        <Text className="text-xs font-light text-gray-800">
          here to access them quickly
        </Text>
      </View>
    </View>
  );
};

export default QuickAccess;
