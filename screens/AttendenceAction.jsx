import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FileUpload, Retry, WelcomeCard } from "../components/AttendenceAction";
import { Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { getPreciseDistance } from "geolib";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCheckin,
  setCheckin,
  setCheckout,
  setOnlyCheckIn,
} from "../redux/Slices/AttendenceSlice";
import Toast from "react-native-toast-message";
import { getOfficeLocation, userCheckIn, userStatusPut } from "../api/userApi";
import { setFileid } from "../redux/Slices/UserSlice";
import { useUserStatus } from "../hooks/fetch.user.status";
const AttendenceAction = ({ navigation }) => {
  const dispatch = useDispatch();
  const checkin = useSelector(selectCheckin);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [inTarget, setInTarget] = useState(false);
  const [isWFH, setIsWFH] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const currentDate = new Date().toISOString();
  // circle radius for loaction bound
  const radiusInMeters = 200;
  const { custom_in, loading, error, retry, custom_loction } =
    useUserStatus(employeeCode);
  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Status failed",
        text2: "Getting status failed, Please retry",
      });
    } else if (custom_in === 0) {
      dispatch(setOnlyCheckIn(false));
    } else {
      dispatch(setOnlyCheckIn(true));
    }

    if (custom_loction === 0) {
      setIsWFH(true);
      setRefresh(false);
      setIsLoading(false);
    }
    if (custom_loction === 1) {
      (async () => {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const userCords = {
          latitude,
          longitude,
        };
        getOfficeLocation(employeeCode)
          .then(({ latitude, longitude }) => {
            // TODO:on production set lat and long
            const targetLocation = {
              latitude, // Convert to numbers
              longitude, // Convert to numbers
            };
            // 11.791130806353708, 75.59082113912703 test coordinates ,
            const distance = getPreciseDistance(userCords, targetLocation);
            setInTarget(distance <= radiusInMeters);
            setIsLoading(false);
            setRefresh(false);
          })
          .catch(() => {
            setIsLoading(false);
            setRefresh(false);
            Toast.show({
              type: "error",
              text1: "Location retreving failed",
              text2: "Please make sure you are at work place",
            });
          });
      })();
    }
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
  // TODO:CODE CLEAN CHECK AFTER BACKEND FIX
  const handleChecking = (type, custom_in) => {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSSSSS");
    const dataField = {
      timestamp,
      employeeCode,
      type,
    };
    userCheckIn(dataField)
      .then(({ name }) => {
        dispatch(setFileid(name));
        userStatusPut(employeeCode, custom_in)
          .then(() => {
            custom_in === 1
              ? dispatch(
                  setCheckin({
                    checkinTime: currentDate,
                    location: isWFH ? "Work from Home" : "Head Office",
                  })
                )
              : dispatch(setCheckout({ checkoutTime: currentDate }));
            Toast.show({
              type: "success",
              text1: `✅ CHECKED ${type}`,
            });
          })
          .catch(() => {
            Toast.show({
              type: "error",
              text1: "Status update failed ",
            });
          });
      })
      .catch((msg) => {
        Toast.show({
          type: "error",
          text1: msg,
        });
      });
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "white",
      }}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => {
            setIsLoading(true);
            setRefresh(true);
          }}
        />
      }
    >
      {error && <Retry retry={retry} navigation={navigation} />}

      {loading && (
        <View className="h-screen absolute bottom-0 w-screen items-center pt-32 bg-black/20 justify-start z-50">
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      )}
      {/* chevron  */}
      <View
        style={{
          width: "100%",
        }}
      >
        <View className="flex-row pb-4 pt-2 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0  pb-4 pt-2 "
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
                  "Work from home"
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
              <React.Fragment>
                <FileUpload inTarget={inTarget} isWFH={isWFH} />
                <TouchableOpacity
                  className={`justify-center ${
                    !inTarget && !isWFH && `opacity-50`
                  } items-center h-16 mt-4 rounded-2xl bg-red-500`}
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
                            return;
                          },
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            handleChecking("OUT", 0);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text className="text-xl font-bold text-white">
                    CHECK-OUT
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ) : (
              <TouchableOpacity
                className={`justify-center ${
                  !inTarget && !isWFH && `opacity-50`
                } items-center h-16 mt-4 rounded-2xl bg-green-500`}
                disabled={!inTarget && !isWFH}
                onPress={() => handleChecking("IN", 1)}
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

export default AttendenceAction;
