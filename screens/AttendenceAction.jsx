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
import { WelcomeCard } from "../components/AttendenceAction";
import { Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { getPreciseDistance } from "geolib";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  selectCheckin,
  setCheckin,
  setCheckout,
  setOnlyCheckIn,
} from "../redux/Slices/AttendenceSlice";
import Toast from "react-native-toast-message";
import {
  getOfficeLocation,
  putUserFile,
  userCheckIn,
  userFileUpload,
  userStatusPut,
} from "../api/userApi";
import { selectFileid, setFileid } from "../redux/Slices/UserSlice";
import * as ImagePicker from "expo-image-picker";
import { useUserStatus } from "../hooks/fetch.user.status";
const AttendenceAction = ({ navigation }) => {
  const dispatch = useDispatch();
  const checkin = useSelector(selectCheckin);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateTime, setDateTime] = useState(null);
  const [inTarget, setInTarget] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const currentDate = new Date().toISOString();
  // circle radius for loaction bound
  const radiusInMeters = 200;
  useEffect(() => {
    (async () => {
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
  }, [refresh]);
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

  const { apiData, loading, error, retry } = useUserStatus(employeeCode);
  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Status failed",
        text2: "Getting status failed, Please retry",
      });
    } else if (apiData === 0) {
      dispatch(setOnlyCheckIn(false));
    } else {
      dispatch(setOnlyCheckIn(true));
    }
  }, [apiData, error, loading]);
  const name = useSelector(selectFileid);
  const handleFileUpload = async (result) => {
    const fileType = result.type;
    const localUri = result.uri;
    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `${fileType}/${match[1]}` : fileType;
    const formData = new FormData();
    formData.append(
      "fieldname",
      fileType === "image" ? "custom_photo" : "custom_video"
    );
    formData.append("file", { uri: localUri, name: filename, type });
    formData.append("is_private", "1");
    formData.append("doctype", "Employee Checkin");
    formData.append("docname", name);
    userFileUpload(formData)
      .then(({ file_url }) => {
        const formData = new FormData();
        if (fileType === "image") {
          formData.append("custom_image", file_url);
        } else {
          formData.append("custom_video", file_url);
        }
        putUserFile(formData, name)
          .then(() => {
            Toast.show({
              type: "success",
              text1:
                fileType === "image"
                  ? "✅ Photo Uploaded"
                  : "✅ Video Uploaded",
            });
          })
          .catch(() => {
            Toast.show({
              type: "error",
              text1:
                fileType === "image"
                  ? "Photo Upload Failed"
                  : "Video Upload Failed",
            });
          });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1:
            fileType === "image"
              ? "Photo Upload Failed"
              : "Video Upload Failed",
        });
      });
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result.canceled) return;
      await handleFileUpload(result.assets[0]);
    } catch (error) {
      // Handle errors from ImagePicker
      alert("Error picking image.");
    }
  };

  const handleCheckin = () => {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSSSSS");
    const datafield = {
      timestamp,
      employeeCode,
      type: "IN",
    };
    userCheckIn(datafield)
      .then(({ name }) => {
        dispatch(setFileid(name));
        userStatusPut(employeeCode, 1)
          .then(() => {
            dispatch(
              setCheckin({ checkinTime: currentDate, location: "Head Office" })
            );
            Toast.show({
              type: "success",
              text1: "✅ CHECKED IN",
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
          const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSSSSS");
          const datafield = {
            timestamp,
            employeeCode,
            type: "OUT",
          };
          userCheckIn(datafield)
            .then(() => {
              userStatusPut(employeeCode, 0)
                .then(() => {
                  dispatch(setCheckout({ checkoutTime: currentDate }));
                  Toast.show({
                    type: "success",
                    text1: "✅ CHECKED OUT",
                  });
                })
                .catch(() => {
                  Toast.show({
                    type: "error",
                    text1: "CHECKED OUT FAILED",
                  });
                });
            })
            .catch(() => {
              Toast.show({
                type: "error",
                text1: "CHECKED OUT FAILED",
              });
            });
        },
      },
    ]);
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
      {error && (
        <View
          style={{}}
          className="h-screen absolute bottom-0 w-screen items-center  bg-black/70  justify-center z-50"
        >
          <Text className="text-lg mb-1 font-normal text-white">
            Status Retrieval Issue
          </Text>
          <View className="w-3/4">
            <Text className="text-xs  text-center mb-10 font-normal text-gray-200">
              We apologize, but we're currently experiencing difficulties
              fetching your status. Please retry or try again later.
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.primary }}
            className="h-12 m-2 flex-row w-3/6 rounded-xl justify-center  space-x-2 items-center"
            onPress={retry}
          >
            <Text className="text-base text-white font-bold">Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ borderColor: COLORS.primary }}
            className="h-12 flex-row w-3/6 rounded-xl justify-center border-2 bg-white space-x-2 items-center"
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{ color: COLORS.primary }}
              className="text-base font-bold"
            >
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View
          style={{}}
          className="h-screen absolute bottom-0 w-screen items-center  justify-center z-50"
        >
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
          <View className="">
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
                <TouchableOpacity
                  className={`justify-center ${
                    inTarget === false && `opacity-50`
                  } items-center h-16 mt-4 flex-row justify-center space-x-2 rounded-2xl bg-blue-500`}
                  disabled={!inTarget}
                  onPress={inTarget && pickImage}
                >
                  <Ionicons
                    name="image"
                    size={SIZES.xxxLarge}
                    color={"white"}
                  />
                  <Text className="text-xl font-bold text-white">
                    Photo or Video
                  </Text>
                </TouchableOpacity>
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
              </React.Fragment>
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
          {!inTarget && (
            <View className="items-center mt-5">
              <Text className="text-xs text-red-400">
                Swipe Down to Refresh
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AttendenceAction;
