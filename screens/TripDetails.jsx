import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopCard } from "../components/TripDetails";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";

const TripDetails = ({ navigation }) => {
  return (
    <SafeAreaView>
      {/* chevron  */}
      <View
        style={{
          width: "100%",
        }}
      >
        <View className="flex-row pb-4 pt-2 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0  pb-4 pt-2 "
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge - SIZES.xSmall}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View className="justify-self-center text-center">
            <Text className="text-lg font-medium">Trip Details</Text>
          </View>
        </View>
      </View>
      <View className="px-3">
        <TopCard />
        <View style={"100%"} className="mt-8">
          <TouchableOpacity className="justify-center h-16 flex-row items-center space-x-2 p-3 bg-blue-500 rounded-xl">
            <Text className="text-xl font-semibold text-white">start trip</Text>
            <Ionicons name="timer-outline" size={28} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TripDetails;
