import { View, TouchableOpacity, FlatList, Text } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS, SIZES } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { LogCard } from "../components/AttendanceHistory";
import { useSelector } from "react-redux";
import { selectName } from "../redux/Slices/UserSlice";
import { getUserAttendance } from "../api/userApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";

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
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const employeeName = useSelector(selectName);

  useEffect(() => {
    getUserAttendance(employeeName)
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data");
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          autoHide: true,
          visibilityTime: 2000,
        });
      });
  }, []);
  const mockData = [
    {
      log_type: "IN",
      time: "10:00 AM",
    },
    {
      log_type: "OUT",
      time: "10:00 AM",
    },
  ];
  return (
    <View className="flex-1">
      {!error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base">{error}</Text>
        </View>
      ) : (
        mockData && (
          <FlatList
            data={mockData}
            contentContainerStyle={{
              flexGrow: 1,
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 15,
              rowGap: 10,
              width: "100%",
            }}
            renderItem={({ item }) => (
              <LogCard type={item.log_type} time={item.time} />
            )}
          />
        )
      )}
    </View>
  );
};

export default AttendanceHistory;
