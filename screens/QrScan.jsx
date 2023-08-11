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
  setFullname,
  setUserDetails,
  setUsername,
} from "../redux/Slices/UserSlice";
const QrScan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    if (!hasPermission) getBarCodeScannerPermissions();
  }, [hasPermission]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) return;
    if (result && result.assets[0].uri) {
      try {
        const scannedResults = await BarCodeScanner.scanFromURLAsync(
          result.assets[0].uri
        );

        const data = scannedResults[0].data;
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
            dispatch(
              setUserDetails({ company, employeeCode, fullName, userId, api })
            );
            navigation.navigate("login");
          } else {
            alert("Retry with valid QR CODE");
          }
        } catch (error) {
          alert("Wrong QR-CODE");
        }
      } catch (error) {
        // if there this no QR code
        setDisplayText("No QR Code Found");
        setTimeout(() => setDisplayText(""), 4000);
      }
    }
  };
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
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
        dispatch(
          setUserDetails({ company, employeeCode, fullName, userId, api })
        );
        navigation.navigate("login");
      } else {
        alert("Retry with valid QR CODE");
      }
    } catch (error) {
      alert("Wrong QR-CODE");
    }
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
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView className="flex-1 items-center px-3 bg-white relative">
      <View style={{ width: "100%" }}>
        <View className="flex-row pb-3 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0 pb-3"
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge - SIZES.xSmall}
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
        className="justify-around items-center bg-black h-auto overflow-hidden rounded-xl"
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
            className=" mt-2 h-20 justify-center rounded-lg"
            onPress={() => setScanned(false)}
          >
            <Text className="text-2xl text-center font-semibold text-white ">
              TAP TO SCAN AGAIN
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: "100%",
              borderColor: COLORS.primary,
            }}
            className="animate-bounce h-20 justify-center rounded-lg bg-white border-2 items-center mt-4 flex-row"
          >
            <Ionicons
              name="qr-code-outline"
              size={SIZES.xxxLarge}
              color={COLORS.primary}
              className=""
            />
            <Text className="text-2xl text-center font-semibold text-orange-600"></Text>
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            width: "100%",
          }}
          className=" mt-2 h-20 justify-center flex-row items-center rounded-lg relative"
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
