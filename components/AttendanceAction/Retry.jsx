import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const Retry = ({retry}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{}}
      className="h-screen absolute bottom-0 w-screen items-center  bg-black/70  justify-center z-50"
    >
      <Text className="text-lg mb-1 font-normal text-white">
        Status Retrieval Issue
      </Text>
      <View className="w-3/4">
        <Text className="text-xs  text-center mb-10 font-normal text-gray-200">
          We apologize, but we're currently experiencing difficulties fetching
          your status. Please retry or try again later.
        </Text>
      </View>
      <TouchableOpacity
        style={{ backgroundColor: COLORS.primary }}
        className="h-12 m-2 flex-row w-3/6 rounded-xl justify-center  space-x-2 items-center"
        onPress={retry}
      >
        <Text className="text-base text-white font-bold">Retry</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ borderColor: COLORS.primary }}
        className="h-12 flex-row w-3/6 rounded-xl justify-center border-2 bg-white space-x-2 items-center"
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: COLORS.primary }} className="text-base font-bold">
          Go back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Retry;
