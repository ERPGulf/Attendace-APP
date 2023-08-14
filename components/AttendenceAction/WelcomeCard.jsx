import { View, Text, Image } from "react-native";
import React from "react";
import { COLORS } from "../../constants";
import checkinimg from "../../assets/images/checkin.png";
import checkoutimg from "../../assets/images/checkout.png";
import { useSelector } from "react-redux";
import { differenceInMinutes, formatDuration } from "date-fns";
import {
  selectCheckin,
  selectCheckinTime,
  selectLocation,
} from "../../redux/Slices/AttendenceSlice";

const WelcomeCard = () => {
  const location = useSelector(selectLocation);
  const currentDate = new Date();
  const checkin = useSelector(selectCheckin);
  const checkinTime = useSelector(selectCheckinTime);
  // Calculate the difference in minutes
  const minutesDifference = differenceInMinutes(
    currentDate,
    new Date(checkinTime)
  );

  // Calculate the hours and remaining minutes
  const hours = Math.floor(minutesDifference / 60);
  const remainingMinutes = minutesDifference % 60;

  // Format the hours and minutes as "00:00" format
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    remainingMinutes
  ).padStart(2, "0")}`;

  return (
    <View
      style={{ width: "100%" }}
      className="px-4 py-4 bg-gray-100 rounded-xl"
    >
      <View
        style={{ backgroundColor: COLORS.primary, width: "100%" }}
        className="h-40 rounded-lg pt-3 px-4 w-full justify-center"
      >
        <View className="flex-row justify-between">
          {checkin ? (
            <View className="w-8/12 -top-3">
              <Text className="text-lg font-normal pt-1 text-white">
                Woring from
              </Text>
              <Text className="text-xl font-bold text-white pb-3">
                {location}
              </Text>
              <Text className="text-base font-normal pt-1 text-white">
                You have been working for
              </Text>
              <Text className="text-xl  font-bold text-white">
                {formattedTime}
              </Text>
            </View>
          ) : (
            <View className="w-8/12">
              <Text className="text-lg font-normal pt-2 text-white">
                Welcome Back!
              </Text>
              <Text className="text-xl pt-2 font-bold text-white">
                Check-In before you start working
              </Text>
            </View>
          )}
          <Image
            source={checkin ? checkoutimg : checkinimg}
            className="h-32 w-32 -left-2"
            resizeMode="contain"
          />
        </View>
      </View>
      <Text className=" text-sm text-center pt-2 text-gray-500 font-medium">
        Last action:Check-out 22 May2023@10:40AM
      </Text>
    </View>
  );
};

export default WelcomeCard;
