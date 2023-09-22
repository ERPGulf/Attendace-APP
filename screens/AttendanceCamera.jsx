import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useNavigation } from "@react-navigation/native";
import {
  setHasTakenPhoto,
  setMediaLocation,
} from "../redux/Slices/AttendanceSlice";

const AttendanceCamera = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMicroPhonePermission, setHasMicroPhonePermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [mode, setMode] = useState("camera");
  const [photo, setPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(null);
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
  const recordVideo = async () => {
    try {
      setIsRecording(true);
      let options = {
        quality: 720,
        maxDuration: 30,
        mute: false,
      };
      cameraRef.current.recordAsync(options).then((video) => {
        setVideo(video);
        setIsRecording(false);
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Video recording failed",
        text2: "Please try again",
      });
    }
  };
  const stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };
  const uploadPicture = async () => {
    Toast.show({
      type: "info",
      text1: "File saved",
      text2: "Uploading file",
    });
    dispatch(setMediaLocation(photo.uri));
    dispatch(setHasTakenPhoto(true));
    navigation.navigate("Attendance action");
  };

  if (hasCameraPermission === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <Text>No access to camera</Text>
        {!hasMicroPhonePermission && <Text>No access to Microphone</Text>}
      </SafeAreaView>
    );
  }
  if (video) {
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
                setVideo(null);
              }}
            >
              <Text className="text-base font-normal text-red-500">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="absolute pb-4 right-0 pt-2"
              onPress={uploadVideo}
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
          <Video
            useNativeControls
            resizeMode="contain"
            className="w-full flex-1"
            source={{ uri: video.uri }}
          />
        </View>
      </View>
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
            onPress={isRecording ? stopRecording : recordVideo}
            style={{ width: 80, height: 80 }}
            className="bg-white justify-center items-center rounded-full"
          >
            <Ionicons
              name={isRecording ? "ios-stop" : "ios-videocam"}
              size={40}
              color={"black"}
            />
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
          disabled={isRecording}
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
