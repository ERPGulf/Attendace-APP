import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { COLORS, SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import base64 from "react-native-base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
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

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(type);
    setScanned(true);
    try {
      const value = base64.decode(data);
      console.log(value);
      const companyMatch = value.match(/Company: (\w+)/);
      const employeeCodeMatch = value.match(/Employee_Code: ([\w-]+)/);
      const userIdMatch = value.match(/User_id: ([\w@.-]+)/);
      const fullNameMatch = value.match(/Full_Name: (\w+\s+\w+)/);
      const apiMatch = value.match(/API: (https:\/\/.+)$/);
      if (fullNameMatch && apiMatch) {
        const company = companyMatch[1];
        const employeeCode = employeeCodeMatch[1];
        const fullName = fullNameMatch[1].trim();
        const userId = userIdMatch[1];
        const api = apiMatch[1];
        console.log(api);
        await AsyncStorage.setItem("baseUrl", api);
        dispatch(setFullname(fullName));
        dispatch(setUsername(userId));
        dispatch(
          setUserDetails({ company, employeeCode, fullName, userId, api })
        );
        navigation.navigate("Login");
      } else {
        alert("Retry with valid QR CODE");
      }
    } catch (error) {
      alert("Wrong QR-CODE");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white">
      <View
        style={{ width: "100%" }}
        className="justify-around items-center bg-black h-auto overflow-hidden rounded-lg"
      >
        <BarCodeScanner
          className="w-full"
          style={{ height: 350 }}
          type={"back"}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>
      {scanned ? (
        <View
          style={{ width: "100%" }}
          className="bg-gray-100 rounded-t-xl  items-center flex pt-2 "
        >
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: "100%",
            }}
            className=" mt-2 h-20 justify-center rounded-lg"
            onPress={() => setScanned(false)}
          >
            <Text className="text-2xl text-center font-semibold text-white ">
              Tap to Scan Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            borderColor: COLORS.primary,
          }}
          className="animate-bounce h-20 justify-center rounded-lg bg-white border-2 items-center mt-4 flex-row"
        >
          <Ionicons
            name="qr-code"
            size={SIZES.xxxLarge}
            color={COLORS.primary}
            className=""
          />
          <Text className="text-2xl text-center font-semibold text-orange-600"></Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default QrScan;
