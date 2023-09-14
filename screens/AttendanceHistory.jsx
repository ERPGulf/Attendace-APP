import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES } from "../constants";
import { useNavigation } from "@react-navigation/native";

const AttendanceHistory = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: "Attendance",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity className="" onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - SIZES.xSmall}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
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
