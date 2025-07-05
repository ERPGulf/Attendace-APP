import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useNavigation } from '@react-navigation/native';
import { format, set } from 'date-fns';
import {
  selectCheckin,
  setCheckin,
  setCheckout,
} from '../redux/Slices/AttendanceSlice';
import {
  putUserFile,
  userCheckIn,
  userFileUpload,
  userStatusPut,
} from '../api/userApi';
import { selectIsWfh, setFileid } from '../redux/Slices/UserSlice';
import { SIZES } from '../constants';
import { hapticsMessage } from '../utils/HapticsMessage';

function AttendanceCamera() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [mode, setMode] = useState('camera');
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkin = useSelector(selectCheckin);
  const { employeeCode } = useSelector(state => state.user.userDetails);
  const isWFH = useSelector(selectIsWfh);
  const currentDate = new Date().toISOString();
  const cameraRef = useRef();

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const changeMode = () => {
    setMode(mode === 'camera' ? 'video' : 'camera');
  };

  const takePicture = async () => {
    try {
      const options = {
        quality: 0.7,
        exif: false,
        base64: true,
      };
      const newPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(newPhoto);
    } catch (error) {
      console.error('Photo capture error:', error);
      Toast.show({
        type: 'error',
        text1: 'Photo capture failed',
      });
    }
  };

  const handleChecking = (type, custom_in) => {
    setIsLoading(true);
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSSSSS');
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
            if (custom_in === 1) {
              dispatch(
                setCheckin({
                  checkinTime: currentDate,
                  location: isWFH ? 'On-site' : 'Head Office',
                }),
              );
            } else {
              dispatch(setCheckout({ checkoutTime: currentDate }));
            }
            uploadPicture(name)
              .then(() => {
                hapticsMessage('success');
                Toast.show({
                  type: 'success',
                  text1: `CHECKED ${type}`,
                  autoHide: true,
                  visibilityTime: 3000,
                });
                setIsLoading(false);
                navigation.navigate('Attendance action');
              })
              .catch((error) => {
                console.error('Upload error:', error);
                hapticsMessage('error');
                Toast.show({
                  type: 'error',
                  text1: 'Photo upload failed',
                  autoHide: true,
                  visibilityTime: 3000,
                });
                setIsLoading(false);
              });
          })
          .catch((error) => {
            console.error('Status update error:', error);
            hapticsMessage('error');
            Toast.show({
              type: 'error',
              text1: 'Status update failed',
              autoHide: true,
              visibilityTime: 3000,
            });
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error('Check-in error:', error);
        hapticsMessage('error');
        Toast.show({
          type: 'error',
          text1: 'Check-in failed',
          autoHide: true,
          visibilityTime: 3000,
        });
        setIsLoading(false);
      });
  };

  // Fixed upload image function for JavaScript
  const uploadPicture = async name => {
    try {
      Toast.show({
        type: 'info',
        text1: 'File being uploaded',
        autoHide: true,
        visibilityTime: 3000,
      });

      const formData = new FormData();
      formData.append('file_name', name);
      formData.append('fieldname', 'custom_photo');
      
      // Fixed file object structure for JavaScript
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `${name}_${Date.now()}.jpg`,
      });
      
      formData.append('is_private', '1');
      formData.append('doctype', 'Employee Checkin');
      formData.append('docname', name);

      const uploadResponse = await userFileUpload(formData);
      
      if (uploadResponse && uploadResponse.file_url) {
        const updateFormData = new FormData();
        updateFormData.append('custom_image', uploadResponse.file_url);
        
        await putUserFile(updateFormData, name);
        return Promise.resolve();
      } else {
        throw new Error('Upload failed - no file URL returned');
      }
    } catch (error) {
      console.error('Upload picture error:', error);
      Toast.show({
        type: 'error',
        text1: 'Photo Upload Failed',
        text2: error.message || 'Unknown error occurred',
      });
      throw error;
    }
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <ActivityIndicator size="large" />
        <Text>Loading camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-3 bg-white relative">
        <Text className="text-center mb-4">We need your permission to show the camera</Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (photo) {
    return (
      <View
        style={{ paddingTop: Constants.statusBarHeight, paddingBottom: 20 }}
        className="flex-1 items-center justify-center bg-white relative"
      >
        <View
          style={{ width: '100%' }}
          className="relative px-3 border-b border-black/30"
        >
          <View className="flex-row pb-4 pt-2 items-center justify-center relative">
            <TouchableOpacity
              className="absolute justify-center items-center left-0 "
              onPress={() => {
                setPhoto(null);
              }}
            >
              <Text className="text-base font-normal text-red-500">Retake</Text>
            </TouchableOpacity>
            <View className="justify-self-center text-center">
              <Text className="text-xl font-medium">Preview</Text>
            </View>
          </View>
        </View>
        <View
          style={{ width: SIZES.width }}
          className="flex-1 border-black/30 px-3 bg-white"
        >
          <Image
            cachePolicy="disk"
            contentFit="cover"
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              borderRadius: 12,
              marginVertical: 12,
            }}
            source={{ uri: `data:image/jpg;base64,${photo.base64}` }}
          />
          <View className="w-full items-center justify-center">
            {checkin ? (
              <TouchableOpacity
                className="justify-center items-center mb-3 bg-blue-500 w-full h-16 rounded-2xl"
                onPress={() => handleChecking('OUT', 0)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-white">
                    CHECK OUT
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="justify-center items-center mb-3 bg-blue-500 w-full h-16 rounded-2xl"
                onPress={() => handleChecking('IN', 1)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-white">
                    CHECK IN
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Camera View - No children */}
      <CameraView
        facing={facing}
        ref={cameraRef}
        style={{
          flex: 1,
        }}
      />
      
      {/* Overlay UI - Positioned absolutely */}
      <View
        style={{
          position: 'absolute',
          top: Constants.statusBarHeight,
          left: 12,
          zIndex: 1,
        }}
      >
        <Ionicons
          name="chevron-back"
          color="white"
          size={SIZES.xxxLarge - SIZES.xSmall}
          onPress={() => navigation.goBack()}
        />
      </View>
      
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
        className="flex-row items-center justify-center w-full px-3 relative"
      >
        {mode === 'camera' ? (
          <TouchableOpacity
            onPress={takePicture}
            style={{ width: 80, height: 80 }}
            className="bg-white justify-center items-center rounded-full"
          >
            <Ionicons name="camera" size={40} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ width: 80, height: 80 }}
            className="bg-white justify-center items-center rounded-full"
          >
            <Ionicons name="videocam" size={40} color="black" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          onPress={toggleCameraFacing}
          style={{
            width: 80,
            height: 80,
            position: 'absolute',
            left: 16,
          }}
          className="justify-center items-center rounded-full"
        >
          <Ionicons name="refresh" size={44} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          disabled={mode === 'camera'}
          onPress={changeMode}
          style={{
            width: 80,
            height: 80,
            position: 'absolute',
            right: 16,
          }}
          className="justify-center items-center rounded-full"
        >
          <Ionicons
            name={mode === 'camera' ? 'videocam' : 'camera'}
            size={44}
            color={mode === 'camera' ? 'grey' : 'white'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AttendanceCamera;
