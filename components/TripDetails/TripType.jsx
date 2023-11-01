import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TripType = ({ setTripType, tripType }) => {
  return (
    <View className="mt-4 flex-row">
      <TouchableOpacity
        onPress={() => {
          setTripType("RM");
        }}
        className={`items-center justify-center rounded-lg flex-grow mx-1 ${
          tripType === "RM" ? "bg-gray-900" : "bg-gray-300"
        }`}
        style={{
          width: 100,
          height: 100,
        }}
      >
        <MaterialCommunityIcons name="cash-plus" size={50} color={"white"} />
        <Text className="font-bold text-white text-lg">RM</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setTripType("NRM");
        }}
        className={`items-center justify-center rounded-lg flex-grow mx-1 ${
          tripType === "NRM" ? "bg-gray-900" : "bg-gray-300"
        }`}
        style={{
          width: 100,
          height: 100,
        }}
      >
        <MaterialCommunityIcons name="cash-remove" size={50} color={"white"} />
        <Text className="font-bold text-white text-lg">NRM</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TripType;
