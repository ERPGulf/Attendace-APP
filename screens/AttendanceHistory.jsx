import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
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
  return (
    <View>
      <Text>AttendanceHistory</Text>
    </View>
  );
};

export default AttendanceHistory;
