import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { differenceInMinutes } from 'date-fns';
import { COLORS } from '../../constants';
import {
  startTimeSelect,
  startedSelect,
} from '../../redux/Slices/TripDetailsSlice';

function TopCard() {
  const isStarted = useSelector(startedSelect);
  const startTime = useSelector(startTimeSelect);
  const [minutes, setMinutes] = useState(null);
  function getMinutes() {
    const minutesDifference = differenceInMinutes(
      new Date(),
      new Date(startTime),
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
  }, [isStarted, startTime]);
  return (
    <View
      style={{ width: '100%' }}
      className="px-4 py-4 bg-slate-200 rounded-xl"
    >
      <View
        style={{ backgroundColor: COLORS.primary }}
        className="h-56 rounded-lg px-3 w-full justify-center items-center"
      >
        {isStarted ? (
          <View className="w-full py-3 justify-center items-center h-56  flex-row">
            <Text className="text-4xl font-medium text-white">{minutes}</Text>
            <Text className="text-lg font-medium ml-2 text-white mt-1">
              Hours
            </Text>
          </View>
        ) : (
          <View className="w-full py-3 justify-end h-56">
            <Text className="text-6xl mt-2 font-semibold text-white">
              Start Trip
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default TopCard;
