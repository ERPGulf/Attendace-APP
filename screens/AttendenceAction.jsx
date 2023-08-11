import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { WelcomeCard } from "../components/AttendenceAction";
import { Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDistance } from "geolib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
const AttendenceAction = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inTarget, setInTarget] = useState(null);
  const radiusInMeters = 1000;
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const userCords = {
        latitude,
        longitude,
      };
      const targetLocation = {
        latitude: 11.79097326955567, // Convert to numbers
        longitude: 75.5910142577121, // Convert to numbers
      };
      const distance = getDistance(userCords, targetLocation);
      console.log(distance);
      alert(JSON.stringify(location));
      setIsLoading(false);
      console.log(location);
      setLocation(location);
      setInTarget(distance <= radiusInMeters);
    })();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* chevron  */}
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
            <Text className="text-lg font-medium">Attendence action</Text>
          </View>
        </View>
      </View>
      <View style={{ width: "95%" }}>
        <WelcomeCard />

        {isLoading ? (
          <View className="pt-10">
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <View className="justify-center items-center py-2">
            {inTarget ? (
              <Text>yes {JSON.stringify(location)}</Text>
            ) : (
              <Text>no {JSON.stringify(location)}</Text>
            )}
            {/* <DateTimePicker
            display="default"
            mode="time"
            dateFormat="dd/mm/yy"
            value={new Date()}
          /> */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AttendenceAction;
