import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants";
import checkinimg from "../../assets/images/checkin.png";
import checkoutimg from "../../assets/images/checkout.png";
import { useSelector } from "react-redux";
import { differenceInMinutes, format } from "date-fns";
import {
  selectCheckin,
  selectCheckinTime,
  selectCheckoutTime,
  selectLocation,
} from "../../redux/Slices/AttendenceSlice";

const WelcomeCard = () => {
  const location = useSelector(selectLocation);
  const checkin = useSelector(selectCheckin);
  const checkinTime = useSelector(selectCheckinTime);
  const [minutes, setMinutes] = useState(null);
  // // Calculate the difference in minutes
  // const minutesDifference = differenceInMinutes(
  //   currentDate,
  //   new Date(checkinTime)
  // );

  // // Calculate the hours and remaining minutes
  // const hours = Math.floor(minutesDifference / 60);
  // const remainingMinutes = minutesDifference % 60;

  // // Format the hours and minutes as "00:00" format
  // const formattedTime = `${String(hours).padStart(2, "0")}:${String(
  //   remainingMinutes
  // ).padStart(2, "0")}`;
  // Calculate the difference in minutes
  function getMinutes() {
    const minutesDifference = differenceInMinutes(
      new Date(),
      new Date(checkinTime)
    );
    // Calculate the hours and remaining minutes
    const hours = Math.floor(minutesDifference / 60);
    const remainingMinutes = minutesDifference % 60;

    // Format the hours and minutes as "00:00" format
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}`;
  }

  // Use a useEffect hook to refresh the minutes every 60 seconds
  useEffect(() => {
    // Function to update the minutes
    const updateMinutes = () => {
      setMinutes(getMinutes());
    };

    // Initial update on mount
    updateMinutes();

    // Set up the interval to update the minutes every 60 seconds
    const intervalId = setInterval(updateMinutes, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const checkoutTime = useSelector(selectCheckoutTime);
  const showDate = checkin
    ? format(new Date(checkinTime), "d MMM yyyy @hh:mm a")
    : format(new Date(checkoutTime), "d MMM yyyy @hh:mm a");

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
                {minutes} minutes
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
        LAST ACTION :{" "}
        {checkin ? `CHECK-IN ${showDate}` : `CHECK-OUT ${showDate}`}
      </Text>
    </View>
  );
};

export default WelcomeCard;
