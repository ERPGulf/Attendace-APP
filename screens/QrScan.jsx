import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { COLORS, SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import base64 from "react-native-base64";
const QrScan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    const value = base64.decode(data);
    console.log(value);
    const companyMatch = value.match(/Company: (\w+)/);
    const employeeCodeMatch = value.match(/Employee_Code: ([\w-]+)/);
    const fullNameMatch = value.match(/Full_Name: (\w+)/);
    const apiMatch = value.match(/API: (https:\/\/.+)$/);

    if (companyMatch && employeeCodeMatch && fullNameMatch && apiMatch) {
      const company = companyMatch[1];
      const employeeCode = employeeCodeMatch[1];
      const fullName = fullNameMatch[1].trim();
      const api = apiMatch[1];

      console.log("Company:", company);
      console.log("Employee Code:", employeeCode);
      console.log("Full Name:", fullName);
      console.log("API:", api);
    } else {
      console.log("Data extraction failed.");
    }
    setScanned(true);
    alert(`Bar code with type ${type} and data ${value} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView className="bg-gray-50 flex-1 px-3 relative">
      <View className="items-center">
        <BarCodeScanner
          type={"back"}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ width: "100%" }}
          className="z-0 h-96"
        />
        {scanned && (
          <TouchableOpacity
            style={{ backgroundColor: COLORS.primary }}
            className="w-full mt-2 h-20 justify-center rounded-lg z-50 absolute bottom-0"
            onPress={() => setScanned(false)}
          >
            <Text className="text-2xl text-center font-semibold text-white ">
              Tap to Scan Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default QrScan;
