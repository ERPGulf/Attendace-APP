import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useNavigation } from "@react-navigation/native";
import {
  selectCheckin,
  setCheckin,
  setCheckout,
} from "../redux/Slices/AttendanceSlice";
import { format } from "date-fns";
import {
  putUserFile,
  userCheckIn,
  userFileUpload,
  userStatusPut,
} from "../api/userApi";
import { selectIsWfh, setFileid } from "../redux/Slices/UserSlice";

const AttendanceCamera = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [mode, setMode] = useState("camera");
  const [photo, setPhoto] = useState(null);
  const checkin = useSelector(selectCheckin);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const isWFH = useSelector(selectIsWfh);
  const currentDate = new Date().toISOString();
  let cameraRef = useRef();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);
  const changeCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const changeMode = () => {
    setMode(mode === "camera" ? "video" : "camera");
  };
  const takePicture = async () => {
    try {
      let options = {
        quality: 0.7,
        exif: false,
        base64: true,
      };
      const newPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(newPhoto);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Photo capture failed",
        text2: "Please try again",
      });
    }
  };
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
            uploadPicture(name)
              .then(() => {
                Toast.show({
                  type: "success",
                  text1: `CHECKED ${type}`,
                  text2: `Please upload your photo or video`,
                  autoHide: true,
                  visibilityTime: 2000,
                });
                navigation.navigate("Attendance action");
              })
              .catch(() => {
                Toast.show({
                  type: "error",
                  text1: "Photo upload failed",
                  autoHide: true,
                  visibilityTime: 2000,
                });
              });
          })
          .catch(() => {
            Toast.show({
              type: "error",
              text1: "Status update failed",
              text2: "Please try again",
              autoHide: true,
              visibilityTime: 2000,
            });
          });
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Check-in failed",
          text2: `Please try again ${error}`,
          autoHide: true,
          visibilityTime: 2000,
        });
      });
  };
  // upload image
  const uploadPicture = async (name) => {
    Toast.show({
      type: "info",
      text1: "File being uploaded",
      text2: "it may take a minute or two dont worry ",
      autoHide: true,
      visibilityTime: 2000,
    });
    const formData = new FormData();
    formData.append("file_name", name);
    formData.append("fieldname", "custom_photo");
    formData.append("file", {
      uri: photo.uri,
      type: "image/jpeg", // Adjust the type based on your image format
      name: `${name + new Date().toISOString()}.jpg`, // Adjust the filename as needed
    });
    formData.append("is_private", "1");
    formData.append("doctype", "Employee Checkin");
    formData.append("docname", name);
    userFileUpload(formData)
      .then(({ file_url }) => {
        const formData = new FormData();
        formData.append("custom_image", file_url);
        putUserFile(formData, name)
          .then(() => {
            return Promise.resolve();
          })
          .catch(() => {
            Toast.show({
              type: "error",
              text1: "Photo Upload Failed",
            });
          });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Photo Upload Failed",
        });
      });
  };

  if (hasCameraPermission === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  if (photo) {
    return (
      <View
        style={{ paddingVertical: Constants.statusBarHeight }}
        className="flex-1 items-center justify-center bg-white relative"
      >
        <View
          style={{ width: "100%" }}
          className="relative px-3 border-b border-black/30"
        >
          <View className="flex-row pb-4 pt-2 items-center justify-center relative">
            <TouchableOpacity
              className="absolute justify-center items-center left-0 "
              onPress={() => {
                setPhoto(null);
              }}
            >
              <Text className="text-base font-medium text-red-500">Retake</Text>
            </TouchableOpacity>
            {checkin ? (
              <TouchableOpacity
                className="absolute justify-center items-center right-0 bg-blue-500 py-1 px-2 rounded-lg"
                onPress={() => handleChecking("OUT", 0)}
              >
                <Text className="text-base font-medium text-white">
                  Check Out
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="absolute justify-center items-center right-0 bg-blue-500 py-1 px-2 rounded-lg"
                onPress={() => handleChecking("IN", 1)}
              >
                <Text className="text-base font-bold text-white">CHECK-IN</Text>
              </TouchableOpacity>
            )}
            <View className="justify-self-center text-center">
              <Text className="text-xl font-medium">Preview</Text>
            </View>
          </View>
        </View>
        <View className="w-full flex-1 border-b border-black/30 px-3 bg-black">
          <Image
            resizeMode="cover"
            className="w-full flex-1"
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          />
        </View>
      </View>
    );
  }
  return (
    <Camera
      type={type}
      ref={cameraRef}
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: Constants.statusBarHeight,
        flexDirection: "column-reverse",
      }}
    >
      <View className="flex-row items-center justify-center w-full px-3 relative">
        {mode === "camera" ? (
          <TouchableOpacity
            onPress={takePicture}
            style={{ width: 80, height: 80 }}
            className="bg-white justify-center items-center rounded-full"
          >
            <Ionicons name={"ios-camera"} size={40} color={"black"} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ width: 80, height: 80 }}
            className="bg-white justify-center items-center rounded-full"
          >
            <Ionicons size={40} color={"black"} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={changeCamera}
          style={{
            width: 80,
            height: 80,
          }}
          className="justify-center  items-center rounded-full left-4 absolute"
        >
          <Ionicons name="refresh" size={44} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={mode === "camera"}
          onPress={changeMode}
          style={{
            width: 80,
            height: 80,
          }}
          className="justify-center items-center rounded-full right-4 absolute"
        >
          <Ionicons
            name={mode === "camera" ? "videocam" : "camera"}
            size={44}
            color={mode === "camera" ? "grey" : "white"}
          />
        </TouchableOpacity>
      </View>
    </Camera>
  );
};

export default AttendanceCamera;
