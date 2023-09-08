import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { COLORS, SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import base64 from "react-native-base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  setBaseUrl,
  setFullname,
  setUserDetails,
  setUsername,
} from "../redux/Slices/UserSlice";
const QrScan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();
  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };
  useEffect(() => {
    if (!hasPermission) {
      getBarCodeScannerPermissions();
    }
  }, [hasPermission]);

  const handleQRCodeData = async (data) => {
    try {
      const value = base64.decode(data);
      const companyMatch = value.match(/Company: (\w+)/);
      const employeeCodeMatch = value.match(/Employee_Code: ([\w-]+)/);
      const userIdMatch = value.match(/User_id: ([\w@.-]+)/);
      const fullNameMatch = value.match(/Full_Name: (\w+\s+\w+)/);
      const apiMatch = value.match(/API: (https:\/\/.+)$/);
      if (fullNameMatch && apiMatch) {
        const company = companyMatch[1];
        const employeeCode = employeeCodeMatch[1];
        const fullName = fullNameMatch[1].trim().replace(/\s+/g, " ");
        const userId = userIdMatch[1];
        const api = apiMatch[1];
        await AsyncStorage.setItem("baseUrl", api);
        dispatch(setFullname(fullName));
        dispatch(setUsername(userId));
        dispatch(setBaseUrl(api));
        dispatch(
          setUserDetails({ company, employeeCode, fullName, userId, api })
        );
        navigation.navigate("login");
      } else {
        alert("Retry with valid QR CODE");
      }
    } catch (error) {
      alert("Invalid QR-CODE");
    }
  };

  const handleImagePicked = async (result) => {
    if (result.canceled) return;

    if (result && result.assets[0].uri) {
      try {
        const scannedResults = await BarCodeScanner.scanFromURLAsync(
          result.assets[0].uri
        );
        const data = scannedResults[0].data;
        await handleQRCodeData(data);
      } catch (error) {
        alert("No QR-CODE Found");
      }
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      await handleImagePicked(result);
    } catch (error) {
      // Handle errors from ImagePicker
      alert("Error picking image.");
    }
  };

  // Handle the QR code scan event
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    await handleQRCodeData(data);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      </SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center px-3 bg-white">
      <View style={{ width: "100%" }} className="relative">
        <View className="flex-row pb-4 pt-2 items-center justify-center relative">
          <TouchableOpacity
            className="absolute pb-4 -left-3 pt-2"
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View className="justify-self-center text-center">
            <Text className="text-lg font-medium">QR CODE</Text>
          </View>
        </View>
      </View>
      <View
        style={{ width: "100%" }}
        className="justify-center items-center bg-white h-auto overflow-hidden rounded-xl top-1/4 absolute"
      >
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          className="w-full"
          style={{ height: 350 }}
          type={"back"}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>

      <View
        style={{
          width: "100%",
          flex: 1,
          justifyContent: "flex-end",
          paddingVertical: 20,
        }}
      >
        {scanned ? (
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: "100%",
            }}
            className=" mt-2 h-16 justify-center rounded-xl items-center flex-row space-x-2"
            onPress={() => setScanned(false)}
          >
            <Ionicons
              name="scan-outline"
              size={SIZES.xxxLarge}
              color={"white"}
              className=""
            />
            <Text className="text-base text-center font-semibold text-white ">
              TAP TO SCAN AGAIN
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: "100%",
              borderColor: COLORS.primary,
            }}
            className="h-16 justify-center rounded-xl bg-white border-2 items-center mt-4 flex-row"
          >
            <Ionicons
              name="qr-code-outline"
              size={SIZES.xxxLarge}
              color={COLORS.primary}
              className=""
            />
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            width: "100%",
          }}
          className=" mt-2 h-16 justify-center flex-row items-center rounded-xl relative"
          onPress={pickImage}
        >
          <View className="mr-2">
            <Ionicons name="image" size={SIZES.xxxLarge} color={"white"} />
          </View>
          <Text className="text-base text-center font-semibold text-white ">
            SELECT FROM PHOTOS
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QrScan;
