import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { revertAll } from "../redux/CommonActions";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Profile",
      headerTitleAlign: "center",
    });
  }, []);
  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity
        // onPress={}
        onPress={() => {
          Alert.alert(
            "Logout out",
            "Are you sure you want to logout",
            [
              {
                text: "Cancel",
                onPress: () => {
                  Toast.show({
                    type: "success",
                    text1: "logout cancelled",
                  });
                },
                style: "cancel",
              },
              {
                text: "OK",
                onPress:() => dispatch(revertAll()),
              },
            ]
          );
        }}
        className="h-14 w-32 justify-center items-center rounded-lg bg-red-500"
      >
        <Text className="text-lg font-semibold text-white">LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
