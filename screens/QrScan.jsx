import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera,useCameraPermissions} from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import {
  setBaseUrl,
  setFullname,
  setUserDetails,
  setUsername,
} from '../redux/Slices/UserSlice';
import { COLORS, SIZES } from '../constants';

function QrScan() {
  const navigation = useNavigation();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: 'Scan QR Code',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - 5}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
  const handleQRCodeData = async data => {
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
        const fullName = fullNameMatch[1].trim().replace(/\s+/g, ' ');
        const userId = userIdMatch[1];
        const api = apiMatch[1];
        await AsyncStorage.setItem('baseUrl', api);
        dispatch(setFullname(fullName));
        dispatch(setUsername(userId));
        dispatch(setBaseUrl(api));
        dispatch(
          setUserDetails({
            company,
            employeeCode,
            fullName,
            api,
          }),
        );
        navigation.navigate('login');
      } else {
        alert('Retry with valid QR CODE');
      }
    } catch (error) {
      alert('Invalid QR-CODE');
    }
  };

  // const handleImagePicked = async result => {
  //   if (result?.canceled) return;
  //   if (result?.assets[0]?.uri) {
  //     try {
  //       const scannedResults = await BarCodeScanner.scanFromURLAsync(
  //         result.assets[0].uri,
  //       );
  //       const { data } = scannedResults[0];
  //       await handleQRCodeData(data);
  //     } catch (error) {
  //       alert('No QR-CODE Found');
  //     }
  //   }
  // };

  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 1,
  //     });
  //     await handleImagePicked(result);
  //   } catch (error) {
  //     // Handle errors from ImagePicker
  //     alert('Error picking image.');
  //   }
  // };

  // Handle the QR code scan event
  const handleQrCodeScanned = async ({ type, data }) => {
    setScanned(true);
    await handleQRCodeData(data);
  };

  if (cameraPermission === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <View>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }
  if (!cameraPermission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <Camera
      barCodeTypes={['qr']}
      style={{ flex: 1, width: '100%', height: '100%' }}
      type="back"
      onBarCodeScanned={scanned ? undefined : handleQrCodeScanned}
      className="flex-1 items-center px-3 py-1 bg-white justify-end relative"
    >
      <View
        style={{
          position: 'absolute',
          top: 100,
          height: SIZES.width * 0.9,
        }}
        className="w-full bg-transparent border-4 border-white/50 rounded-2xl justify-center items-center"
      >
        <Ionicons
          name="qr-code-outline"
          size={SIZES.width * 0.6}
          color="rgba(255,255,255,0.1)"
          className=""
        />
      </View>
      <View
        style={{
          width: '100%',
          flex: 0.2,
          justifyContent: 'flex-end',
          paddingVertical: 20,
        }}
      >
        {scanned ? (
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: '100%',
            }}
            className="mt-2 h-16 justify-center rounded-xl items-center flex-row space-x-2"
            onPress={() => setScanned(false)}
          >
            <Ionicons
              name="scan-outline"
              size={SIZES.xxxLarge}
              color="white"
              className=""
            />
            <Text className="text-base text-center font-semibold text-white ">
              TAP TO SCAN AGAIN
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: '100%',
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

        {/* <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            width: '100%',
          }}
          className=" mt-2 h-16 justify-center flex-row items-center rounded-xl relative"
          onPress={pickImage}
        >
          <View className="mr-2">
            <Ionicons name="image" size={SIZES.xxxLarge} color="white" />
          </View>
          <Text className="text-base text-center font-semibold text-white ">
            SELECT FROM PHOTOS
          </Text>
        </TouchableOpacity> */}
      </View>
    </Camera>
  );
}

export default QrScan;
