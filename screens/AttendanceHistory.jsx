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
import { set } from "date-fns";

const AttendanceHistory = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: "Attendance history",
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
  const [error, setError] = useState(false);
  const employeeCode = useSelector(selectEmployeeCode);
  useEffect(() => {
    getUserAttendance(employeeCode, limit_start)
      .then((res) => {
        if (limit_start === 0) {
          setData(res);
          return;
        }
        setData([...data, ...res]);
      })
      .catch(() => {
        setError(true);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          autoHide: true,
          visibilityTime: 2000,
        });
      });
  }, [limit_start]);
  const loadMoreItem = () => {
    setLimitStart((prev) => prev + 1);
  };
  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (data && data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">No data found</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      {error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">
            Something went wrong! Please try again.{" "}
          </Text>
        </View>
      ) : (
        data && (
          <FlatList
            data={data}
            contentContainerStyle={{
              paddingVertical: 15,
              paddingHorizontal: 15,
              rowGap: 10,
              width: "100%",
            }}
            renderItem={({ item }) => (
              <LogCard type={item.log_type} time={item.time} />
            )}
            ListFooterComponent={<RenderLoader />}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0}
          />
        )
      )}
    </View>
  );
};

export default AttendanceHistory;
