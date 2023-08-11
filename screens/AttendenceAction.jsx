import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WelcomeCard } from "../components/AttendenceAction";
import { Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { getPreciseDistance } from "geolib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCheckin,
  setCheckin,
  setCheckout,
} from "../redux/Slices/AttendenceSlice";
import Toast from "react-native-toast-message";
const AttendenceAction = ({ navigation }) => {
  const dispatch = useDispatch();
  const checkin = useSelector(selectCheckin);
  const [isLoading, setIsLoading] = useState(true);
  const [dateTime, setDateTime] = useState(null);
  const [inTarget, setInTarget] = useState(null);
  const radiusInMeters = 250;
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const userCords = {
        latitude,
        longitude,
      };
      const targetLocation = {
        latitude: 11.970086277093973, // Convert to numbers
        longitude: 75.658770510256, // Convert to numbers
      };
      const distance = getPreciseDistance(userCords, targetLocation);
      setIsLoading(false);
      setInTarget(distance <= radiusInMeters);
    })();
  }, []);
  useEffect(() => {
    const date = new Date();
    const dateFormat = "d MMM yyyy @hh:mm a";
    const formattedDate = format(date, dateFormat);
    setDateTime(formattedDate);
  }, []);

  const handleCheckin = () => {
    dispatch(setCheckin({ checkinTime: dateTime, location: "Head Office" }));
    Toast.show({
      type: "success",
      text1: "✅ CHECKED IN",
    });
  };
  const handleChekout = () => {
    Alert.alert("Check out", "Are you sure you want to check out", [
      {
        text: "Cancel",
        onPress: () => {
          Toast.show({
            type: "success",
            text1: "CHECK-OUT CANCELLED",
          });
          return;
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(setCheckout({ checkoutTime: dateTime }));
          Toast.show({
            type: "success",
            text1: "✅ CHECKED OUT",
          });
        },
      },
    ]);
  };
  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      {/* chevron  */}
      <View style={{ width: "100%" }}>
        <View className="flex-row pb-3 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0 pb-3"
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge - SIZES.xSmall}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View className="justify-self-center text-center">
            <Text className="text-lg font-medium">Attendence action</Text>
          </View>
        </View>
      </View>
      <View style={{ width: "100%" }} className="px-3">
        <WelcomeCard />

        {isLoading ? (
          <View className="pt-10">
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <View className="h-72 mt-4">
            <View className="p-4">
              <Text className="text-lg text-gray-500 font-semibold">
                DATE AND TIME*
              </Text>
              <View className="flex-row items-end border-b border-gray-400 pb-2 mb-6 justify-between">
                <Text className="text-base font-medium text-gray-500">
                  {dateTime}
                </Text>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={SIZES.xxxLarge - SIZES.xSmall}
                />
              </View>
              <Text className="text-lg text-gray-500 font-semibold">
                LOCATION*
              </Text>
              <View className="flex-row items-end border-b border-gray-400 pb-2 mb-4 justify-between">
                <Text className="text-base font-medium text-gray-500">
                  {inTarget ? "Head Office" : "Out of bound"}
                </Text>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={SIZES.xxxLarge - SIZES.xSmall}
                />
              </View>
              {checkin ? (
                <TouchableOpacity
                  className={`justify-center ${
                    inTarget === false && `opacity-50`
                  } items-center h-16 mt-4 rounded-2xl bg-red-500`}
                  disabled={!inTarget}
                  onPress={inTarget && handleChekout}
                >
                  <Text className="text-xl font-bold text-white">
                    CHECK-OUT
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className={`justify-center ${
                    inTarget === false && `opacity-50`
                  } items-center h-16 mt-4 rounded-2xl bg-green-500`}
                  disabled={!inTarget}
                  onPress={inTarget && handleCheckin}
                >
                  <Text className="text-xl font-bold text-white">CHECK-IN</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AttendenceAction;
