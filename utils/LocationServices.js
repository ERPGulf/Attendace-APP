import * as Location from "expo-location";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export const useLocationForegroundAccess = async () => {
  try {
    Toast.show({
      type: "info",
      text1: "Requesting location access",
      autoHide: true,
      visibilityTime: 2000,
    });
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return Toast.show({
        type: "error",
        text1: "Location access not granted",
        text2: "Please enable location access to continue",
        autoHide: true,
        visibilityTime: 3000,
      });
    }
    if (status === "granted") {
      Toast.show({
        type: "success",
        text1: "Location access granted",
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Location access not granted",
      autoHide: true,
      visibilityTime: 3000,
    });
  }
};

export const getPreciseCoordinates = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = location.coords;
    const userCords = {
      latitude,
      longitude,
    };
    return userCords;
  } catch (error) {
    console.error(error, "pricise coordinates error");
    Toast.show({
      type: "error",
      text1: "Location retreving failed",
      autoHide: true,
      visibilityTime: 3000,
    });
  }
};
