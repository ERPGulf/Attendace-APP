import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { revertAll } from "../redux/CommonActions";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../constants";
import user from "../assets/images/user.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    dispatch(revertAll());
    await AsyncStorage.clear();
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
      {/* scrollview */}
      <ScrollView
        contentContainerStyle={{
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
            <Image source={user} style={{ width: 75, height: 75 }} />
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
                  Toast.show({
                    type: "info",
                    text1: "Logout cancelled",
                    visibilityTime: 2000,
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
          style={{ backgroundColor: COLORS.primary }}
          className="flex-row h-16 w-full items-center rounded-xl px-3 justify-between bg-white mt-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out" color={"red"} size={34} />
            <Text className="ml-2 text-lg font-semibold text-red-500">
              LOGOUT
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={30} color={"red"} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
