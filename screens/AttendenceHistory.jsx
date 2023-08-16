import { View, Text } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AttendenceHistory = () => {
  useEffect(() => {
    (async () => {
      console.log("chaging acctkn");
      console.log(await AsyncStorage.getItem("access_token"));
      await AsyncStorage.setItem("access_token", "new token change");
      console.log(await AsyncStorage.getItem("access_token"));
      console.log(await AsyncStorage.getItem("refresh_token"));
    })();
  }, []);
  return (
    <View>
      <Text>AttendenceHistory</Text>
    </View>
  );
};

export default AttendenceHistory;
