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
import * as Location from "expo-location";
import { format } from "date-fns";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectCheckin, setOnlyCheckIn } from "../redux/Slices/AttendanceSlice";
import Toast from "react-native-toast-message";
import { getOfficeLocation } from "../api/userApi";
import { useUserStatus } from "../hooks/fetch.user.status";
import { useNavigation } from "@react-navigation/native";
import { setIsWfh } from "../redux/Slices/UserSlice";
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
            size={SIZES.xxxLarge - SIZES.xSmall}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
  const dispatch = useDispatch();
  const checkin = useSelector(selectCheckin);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [inTarget, setInTarget] = useState(false);
  const [isWFH, setIsWFH] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  // circle radius for loaction bound
  const radiusInMeters = 250;

  //FIX FLICKERING
  const { custom_in, loading, error, retry, custom_loction, custom_radius } =
    useUserStatus(employeeCode);
  useEffect(() => {
    dispatch(setOnlyCheckIn(custom_in === 1));
    if (error) {
      Toast.show({
        type: "error",
        text1: "Status failed",
        text2: "Getting status failed, Please retry",
        autoHide: true,
        visibilityTime: 2000,
      });
    }

    if (custom_loction === 0) {
      setIsWFH(true);
      dispatch(setIsWfh(true));
    }
    if (custom_loction === 1) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setIsLoading(false);
          return Toast.show({
            type: "error",
            text1: "Location access not granted",
            text2: "Please enable location access",
            autoHide: true,
            visibilityTime: 2000,
          });
        }
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const { latitude, longitude } = location.coords;
          const userCords = {
            latitude,
            longitude,
          };
          getOfficeLocation(employeeCode)
            .then(({ latitude, longitude }) => {
              const targetLocation = {
                latitude, // Convert to numbers
                longitude, // Convert to numbers
              };
              const distance = getPreciseDistance(userCords, targetLocation);
              if (!custom_radius) {
                return setInTarget(distance <= radiusInMeters);
              }
              setInTarget(distance <= parseFloat(custom_radius));
            })
            .catch(() => {
              Toast.show({
                type: "error",
                text1: "Location retreving failed",
                text2: "Please check your internet connection",
                autoHide: true,
                visibilityTime: 2000,
              });
            });
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Location retreving failed",
            text2: "Please make sure you are at work place",
          });
        }
      })();
    }
    setRefresh(false);
    setIsLoading(false);
  }, [refresh, custom_in, error, loading]);
  useEffect(() => {
    // Function to update the date and time in the specified format
    const updateDateTime = () => {
      const currentDate = new Date();
      const dateFormat = "d MMM yyyy @hh:mm a";
      const formattedDate = format(currentDate, dateFormat);
      setDateTime(formattedDate);
    };

    // Call the updateDateTime function initially
    updateDateTime();

    // Set up a recurring update every 30 seconds
    const intervalId = setInterval(updateDateTime, 10000);

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
            setIsLoading(true);
            setRefresh(true);
            retry();
          }}
        />
      }
    >
      {error && <Retry retry={retry} />}

      {loading && (
        <View className="h-screen absolute bottom-0 w-screen items-center bg-black/50 justify-center z-50">
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      )}
      <View style={{ width: "100%" }} className=" flex-1 px-3">
        <WelcomeCard />
        <View className="h-72 mt-4">
          <View className="p-3">
            <Text className="text-base text-gray-500 font-semibold">
              DATE AND TIME*
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
              LOCATION*
            </Text>
            <View className="flex-row items-end border-b border-gray-400 pb-2 mb-4 justify-between">
              <Text className="text-sm font-medium text-gray-500">
                {isLoading ? (
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
                  Alert.alert(
                    "Check out",
                    "Are you sure you want to check out",
                    [
                      {
                        text: "Cancel",
                        onPress: () => {
                          Toast.show({
                            type: "success",
                            text1: "CHECK-OUT CANCELLED",
                          });
                        },
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          navigation.navigate("Attendance camera");
                        },
                      },
                    ]
                  );
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
