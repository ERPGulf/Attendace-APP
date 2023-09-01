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
import { useSelector } from "react-redux";
import { selectFileid } from "../redux/Slices/UserSlice";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { putUserFile, userFileUpload } from "../api/userApi";

const AttendanceCamera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicroPhonePermission, setHasMicroPhonePermission] = useState(null);

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [mode, setMode] = useState("camera");
  const [photo, setPhoto] = useState(null);
  let cameraRef = useRef();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microPhonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicroPhonePermission(microPhonePermission.status === "granted");
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
    let options = {
      quality: 0.7,
      exif: false,
      base64: true,
    };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };
  const name = useSelector(selectFileid);
  const uploadPicture = async () => {
    console.log(photo.uri);
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
        console.log(file_url);
        const formData = new FormData();
        formData.append("custom_image", file_url);
        putUserFile(formData, name)
          .then(() => {
            Toast.show({
              type: "success",
              text1: "✅ Photo Uploaded",
            });
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
              className="absolute pb-4 left-0 pt-2"
              onPress={() => {
                setPhoto(null);
              }}
            >
              <Text className="text-base font-normal text-red-500">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="absolute pb-4 right-0 pt-2"
              onPress={uploadPicture}
            >
              <Text className="text-base font-normal text-blue-500">
                Upload
              </Text>
            </TouchableOpacity>
            <View className="justify-self-center text-center">
              <Text className="text-xl font-medium">Preview</Text>
            </View>
          </View>
        </View>
        <View className="w-full flex-1 border-b border-black/30">
          <Image
            resizeMode="contain"
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
        <TouchableOpacity
          onPress={takePicture}
          style={{ width: 80, height: 80 }}
          className="bg-white justify-center items-center rounded-full"
        >
          <Ionicons name="ios-camera" size={40} color={"black"} />
        </TouchableOpacity>
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
            color={"white"}
          />
        </TouchableOpacity>
      </View>
    </Camera>
  );
};

export default AttendanceCamera;
