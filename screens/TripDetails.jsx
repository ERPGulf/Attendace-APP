import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopCard } from "../components/TripDetails";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setEndTrip,
  setStartTrip,
  startedSelect,
} from "../redux/Slices/TripDetailsSlice";

const TripDetails = ({ navigation }) => {
  const started = useSelector(startedSelect);
  const dispatch = useDispatch();
  const handleStart = () => {
    dispatch(setStartTrip(new Date().toISOString()));
  };
  const handleEnd = () => {
    dispatch(setEndTrip(new Date().toISOString()));
  };
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
        <View style={"100%"} className="mt-8 items-center">
          <TouchableOpacity
            onPress={started ? handleEnd : handleStart}
            className={`justify-center h-16 flex-row items-center space-x-2 p-3 ${
              started ? "bg-red-500" : "bg-blue-500"
            } rounded-xl w-full`}
          >
            <Text className="text-2xl font-semibold text-white">
              {started ? "end" : "start"} trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TripDetails;
