import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { Image } from "expo-image";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { revertAll } from "../redux/CommonActions";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../constants";
import user from "../assets/images/user.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hapticsMessage } from "../utils/HapticsMessage";
import { selectUserDetails } from "../redux/Slices/UserSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "My Profile",
      headerTitleAlign: "center",
      headerShadowVisible: false,
    });
  }, []);
  const fullname = useSelector((state) => state.user.fullname);
  const handleLogout = async () => {
    try {
      hapticsMessage("success");
      dispatch(revertAll());
      await AsyncStorage.clear();
    } catch (error) {
      console.error(error, "logout error");
      hapticsMessage("error");
      Toast.show({
        type: "error",
        text1: "Logout failed",
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          width: SIZES.width,
          paddingHorizontal: 12,
          paddingVertical: 16,
          alignItems: "center",
        }}
      >
        <View
          style={{ backgroundColor: COLORS.primary }}
          className="flex-row w-full h-24 rounded-2xl"
        >
          <View className="justify-center items-center p-3">
            <Image
              cachePolicy={"memory-disk"}
              source={user}
              style={{ width: 75, height: 75 }}
            />
          </View>
          <View className="justify-center">
            <Text className="text-xl font-semibold text-white">{fullname}</Text>
            <Text className="text-base font-normal text-gray-300">
              Employee
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Logout out", "Are you sure you want to logout", [
              {
                text: "Cancel",
                onPress: () => {
                  hapticsMessage("warning");
                  Toast.show({
                    type: "info",
                    text1: "Logout cancelled",
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                },
                style: "cancel",
              },
              {
                text: "OK",
                onPress: handleLogout,
              },
            ]);
          }}
          className={`flex-row h-16 w-full items-center rounded-xl px-3 justify-between bg-white mt-4 ${
            Platform.OS === "ios"
              ? "shadow-sm shadow-black/10"
              : "shadow-sm shadow-black"
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out" color={"red"} size={34} />
            <Text className="ml-2 text-lg font-semibold text-red-500">
              LOGOUT
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color={"red"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
