import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Retry, WelcomeCard } from "../components/AttendanceAction";
import { COLORS, SIZES } from "../constants";
import { getPreciseDistance } from "geolib";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectCheckin, setOnlyCheckIn } from "../redux/Slices/AttendanceSlice";
import Toast from "react-native-toast-message";
import { getOfficeLocation, getUserCustomIn } from "../api/userApi";
import { useNavigation } from "@react-navigation/native";
import { setIsWfh } from "../redux/Slices/UserSlice";
import { useQuery } from "@tanstack/react-query";
import {
  getPreciseCoordinates,
  useLocationForegroundAccess,
} from "../utils/LocationServices";
import { updateDateTime } from "../utils/TimeServices";
import { hapticsMessage } from "../utils/HapticsMessage";
const AttendanceAction = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: "Attendance action",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity className="" onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - 5}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
  const dispatch = useDispatch();
  const checkin = useSelector(selectCheckin);
  const [refresh, setRefresh] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [inTarget, setInTarget] = useState(false);
  const [isWFH, setIsWFH] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  // circle radius for loaction bound
  const radiusInMeters = 250;
  const {
    data: custom,
    isLoading: customIsLoading,
    isSuccess: customIsSuccess,
    isError: customIsError,
    refetch,
  } = useQuery({
    queryKey: ["custom_in", employeeCode],
    queryFn: () => getUserCustomIn(employeeCode),
  });
  useEffect(() => {
    if (customIsError) {
      hapticsMessage("error");
      Toast.show({
        type: "error",
        text1: `${"⚠️"} Status fetching failed`,
        autoHide: true,
        visibilityTime: 3000,
      });
    }
    if (!customIsLoading && customIsSuccess) {
      dispatch(setOnlyCheckIn(custom.custom_in === 1));
      setIsWFH(custom.custom_restrict_location === 0);
      dispatch(setIsWfh(custom.custom_restrict_location === 0));
      if (custom.custom_restrict_location === 1) {
        const checkUserDistanceToOffice = async (
          employeeCode,
          custom_radius,
          radiusInMeters
        ) => {
          try {
            await useLocationForegroundAccess();
            const userCords = await getPreciseCoordinates();
            const { latitude, longitude } = await getOfficeLocation(
              employeeCode
            );
            const targetLocation = {
              latitude, // Convert to numbers
              longitude, // Convert to numbers
            };
            const distance = getPreciseDistance(userCords, targetLocation);
            if (!custom_radius) {
              return setInTarget(distance <= radiusInMeters);
            }
            setInTarget(distance <= parseFloat(custom_radius));
          } catch (error) {
            Toast.show({
              type: "error",
              text1: `${"⚠️"} Something went wrong`,
            });
          }
        };

        // Call the function
        checkUserDistanceToOffice(
          employeeCode,
          custom.custom_reporting_radius,
          radiusInMeters
        );
      }
    }
  }, [custom]);
  useEffect(() => {
    // Function to update the date and time in the specified format
    const update = () => {
      setDateTime(updateDateTime());
    };

    // Call the updateDateTime function initially
    update();

    // Set up a recurring update every 30 seconds
    const intervalId = setInterval(update, 9000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 16,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => {
            setRefresh(true);
            refetch().finally(() => setRefresh(false));
          }}
        />
      }
    >
      {customIsError && <Retry retry={refetch} />}

      {customIsLoading && (
        <View className="h-screen absolute bottom-0 w-screen items-center bg-black/50 justify-center z-50">
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      )}
      <View style={{ width: "100%" }} className=" flex-1 px-3">
        <WelcomeCard />
        <View className="h-72 mt-4">
          <View className="p-3">
            <Text className="text-base text-gray-500 font-semibold">
              DATE AND TIME *
            </Text>
            <View className="flex-row items-end border-b border-gray-400 pb-2 mb-6 justify-between">
              <Text className="text-sm font-medium text-gray-500">
                {dateTime}
              </Text>
              <MaterialCommunityIcons
                name="calendar-month"
                size={28}
                color={COLORS.gray}
              />
            </View>
            <Text className="text-base text-gray-500 font-semibold">
              LOCATION *
            </Text>
            <View className="flex-row items-end border-b border-gray-400 pb-2 mb-4 justify-between">
              <Text className="text-sm font-medium text-gray-500">
                {customIsLoading ? (
                  <View className="">
                    <ActivityIndicator size={"small"} />
                  </View>
                ) : inTarget ? (
                  "Head Office"
                ) : isWFH ? (
                  "in bound"
                ) : (
                  "Out of bound"
                )}
              </Text>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={28}
                color={COLORS.gray}
              />
            </View>
            {checkin ? (
              <TouchableOpacity
                className={`justify-center  ${
                  !inTarget && !isWFH && `opacity-50`
                } items-center h-16 mt-4 rounded-2xl bg-red-600`}
                disabled={!inTarget && !isWFH}
                onPress={() => {
                  navigation.navigate("Attendance camera");
                }}
              >
                <Text className="text-xl font-bold text-white">CHECK-OUT</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`justify-center ${
                  !inTarget && !isWFH && `opacity-50`
                } items-center h-16 mt-4 rounded-2xl bg-green-600`}
                disabled={!inTarget && !isWFH}
                // onPress={() => handleChecking("IN", 1)}
                onPress={() => navigation.navigate("Attendance camera")}
              >
                <Text className="text-xl font-bold text-white">CHECK-IN</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {!inTarget && !isWFH && (
        <View className="items-center mt-auto mb-4">
          <Text className="text-xs text-gray-400">Swipe Down to Refresh*</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AttendanceAction;
