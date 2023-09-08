import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { TopNav } from "../components/global";
const TripDetails = ({ navigation }) => {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const started = useSelector(startedSelect);
  const [tripType, setTripType] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const dispatch = useDispatch();
  useEffect(() => {
    const tripStatus = async () => {
      setIsLoading(true);
      try {
        await userTripStatus(employeeCode).then(({ trip_status, trip_no }) => {
          if (trip_status) {
            dispatch(setTripId(trip_no));
            dispatch(setStarted());
          } else if (trip_status === 0) {
            dispatch(setEndTrip());
          }
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Getting trip status failed",
        });
      }
      setIsLoading(false);
    };
    tripStatus();
  }, [employeeCode]);
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
      <SafeAreaView className="flex-1 bg-white">
        <TopNav navigation={navigation} title={"Trip details"} />

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
              <React.Fragment>
                <TripType setTripType={setTripType} tripType={tripType} />
                <StartForm
                  location={location}
                  setIsLoading={setIsLoading}
                  tripType={tripType}
                />
              </React.Fragment>
            ) : (
              <EndForm
                location={location}
                setIsLoading={setIsLoading}
                setTripType={setTripType}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default TripDetails;
