import { View, Text } from "react-native";
import React from "react";
import { COLORS } from "../../constants";

const TopCard = () => {
  return (
    <View
      style={{ width: "100%" }}
      className="px-4 py-4 bg-slate-200 rounded-xl"
    >
      <View
        style={{ backgroundColor: COLORS.primary, width: "100%" }}
        className="h-56 rounded-lg px-3 w-full justify-center items-center"
      ></View>
    </View>
  );
};

export default TopCard;
