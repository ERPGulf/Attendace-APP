import { View, Text } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendanceHistory = () => {
  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem("access_token", "23456");
    })();
  });
  return (
    <View>
      <Text>AttendanceHistory</Text>
    </View>
  );
};

export default AttendanceHistory;
