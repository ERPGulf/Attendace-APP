import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { differenceInMinutes, format } from 'date-fns';
import { COLORS } from '../../constants';
import checkinimg from '../../assets/images/checkin.png';
import checkoutimg from '../../assets/images/checkout.png';
import {
  selectCheckin,
  selectCheckinTime,
  selectLocation,
} from '../../redux/Slices/AttendanceSlice';

function WelcomeCard() {
  const location = useSelector(selectLocation);
  const checkin = useSelector(selectCheckin);
  const checkinTime = useSelector(selectCheckinTime);
  const [minutes, setMinutes] = useState(null);

  function getMinutes() {
    const minutesDifference = differenceInMinutes(
      new Date(),
      new Date(checkinTime),
    );
    // Calculate the hours and remaining minutes
    const hours = Math.floor(minutesDifference / 60);
    const remainingMinutes = minutesDifference % 60;

    // Format the hours and minutes as "00:00" format
    return `${String(hours).padStart(2, '0')}:${String(
      remainingMinutes,
    ).padStart(2, '0')}`;
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
  }, [checkin]);
  return (
    <View
      style={{ width: '100%' }}
      className="px-4 py-4 bg-slate-200 rounded-xl"
    >
      <View
        style={{ backgroundColor: COLORS.primary, width: '100%' }}
        className="h-40 rounded-lg px-3 w-full justify-center items-center"
      >
        <View className="flex-row justify-between w-full h-40 items-center">
          {checkin ? (
            <View className=" w-3/5 break-words h-40 justify-center">
              <Text className="text-base font-normal pt-1 text-white">
                Working from
              </Text>
              <Text className="text-lg font-bold text-white pb-1">
                {location}
              </Text>
              <Text className="text-base font-normal pt-1 text-white">
                You have been working for
              </Text>
              <Text className="text-lg  font-bold text-white">
                {minutes} Hours
              </Text>
            </View>
          ) : (
            <View className="w-6/12 h-40 justify-center">
              <Text className="text-base font-normal pt-2 text-white">
                Welcome Back!
              </Text>
              <Text className="text-lg pt-2 font-bold text-white">
                Check-In before you start working
              </Text>
            </View>
          )}
          <Image
            cachePolicy="memory-disk"
            source={checkin ? checkoutimg : checkinimg}
            className=" h-24 w-24"
            contentFit="contain"
          />
        </View>
      </View>
    </View>
  );
}

export default WelcomeCard;
