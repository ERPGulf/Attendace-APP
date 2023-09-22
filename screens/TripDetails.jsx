import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import * as Location from "expo-location";
import {
  EndForm,
  StartForm,
  TopCard,
  TripType,
} from "../components/TripDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  setEndTrip,
  setStarted,
  setTripId,
  startedSelect,
} from "../redux/Slices/TripDetailsSlice";
import { userTripStatus } from "../api/userApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS, SIZES } from "../constants";
import { useNavigation } from "@react-navigation/native";
const TripDetails = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: "Trip Details",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity className="" onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - SIZES.xSmall}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const started = useSelector(startedSelect);
  const [tripType, setTripType] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { trip_status, trip_no } = await userTripStatus(employeeCode);
        if (trip_status) {
          dispatch(setTripId(trip_no));
          dispatch(setStarted());
        } else if (trip_status === 0) {
          dispatch(setEndTrip());
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Getting trip status failed",
        });
      }
      setIsLoading(false);
    })();
  }, [refresh]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;
      setIsLoading(false);
      setRefresh(false);
      setLocation({ latitude, longitude });
    })();
  }, [started, refresh]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      behavior="padding"
      enabled
    >
      <View className="flex-1 bg-white">
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                setRefresh(true);
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "flex-start",
            flexGrow: 1,
            alignItems: "center",
            backgroundColor: "white",
            paddingBottom: 12,
          }}
        >
          {isLoading && (
            <View className="h-screen absolute pt-9 bottom-0 w-screen items-center bg-black/50 justify-center z-50">
              <ActivityIndicator size={"large"} color={"white"} />
            </View>
          )}
          <View style={{ width: "100%" }} className="px-3 flex-grow">
            <TopCard />
            {!started ? (
              <View className="px-3">
                <TripType setTripType={setTripType} tripType={tripType} />
                <StartForm
                  location={location}
                  setIsLoading={setIsLoading}
                  tripType={tripType}
                />
              </View>
            ) : (
              <View className='px-3'>
                <EndForm
                  location={location}
                  setIsLoading={setIsLoading}
                  setTripType={setTripType}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TripDetails;
