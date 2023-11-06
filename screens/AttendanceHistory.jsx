import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS, SIZES } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { LogCard, RenderLoader } from "../components/AttendanceHistory";
import { useSelector } from "react-redux";
import { selectEmployeeCode } from "../redux/Slices/UserSlice";
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
  const [limit_start, setLimitStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const employeeCode = useSelector(selectEmployeeCode);
  useEffect(() => {
    setIsLoading(true);
    getUserAttendance(employeeCode, limit_start)
      .then((res) => {
        setData([...data, ...res]);
      })
      .catch(() => {
        setError("Failed to fetch data");
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          autoHide: true,
          visibilityTime: 2000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [limit_start]);
  const loadMoreItem = () => {
    setLimitStart((prev) => prev + 1);
  };
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
    <View className="flex-1 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">{error}</Text>
        </View>
      ) : (
        mockData && (
          <FlatList
            data={data}
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
            ListFooterComponent={<RenderLoader isLoading={isLoading} />}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
          />
        )
      )}
    </View>
  );
};

export default AttendanceHistory;
