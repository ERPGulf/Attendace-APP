import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
const AttendanceCamera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  let cameraRef = useRef();
  useEffect(() => {
    const requestCameraPermissionsAndSetState = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission === "granted");
    };
    (async () => {
      await requestCameraPermissionsAndSetState();
    })();
    if (hasCameraPermission === null) requestCameraPermissionsAndSetState();
  }, []);
  if (hasCameraPermission === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }
  return (
    <Camera style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>AttendanceCamera</Text>
    </Camera>
  );
};

export default AttendanceCamera;
