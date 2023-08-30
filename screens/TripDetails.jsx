import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopCard } from "../components/TripDetails";
import { Entypo, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setEndTrip,
  setStartTrip,
  setStarted,
  setTripId,
  startedSelect,
  tripIdSelect,
} from "../redux/Slices/TripDetailsSlice";
import { endTripTrack, tripTrack, userTripStatus } from "../api/userApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Formik } from "formik";
import * as Yup from "yup";
import { format, parse } from "date-fns";
const TripDetails = ({ navigation }) => {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const started = useSelector(startedSelect);
  const [tripType, setTripType] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const dispatch = useDispatch();
  useEffect(() => {
    const tripStatus = () => {
      setIsLoading(true);
      userTripStatus(employeeCode)
        .then(({ custom_trip_status, custom_trip_type, name }) => {
          if (custom_trip_status == 1) {
            dispatch(setTripId(name));
            dispatch(setStarted(custom_trip_type));
          }
          if (custom_trip_status == 0) {
            dispatch(setEndTrip());
          }
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Getting trip status failed",
          });
        });
      setIsLoading(false);
    };
    tripStatus();
  }, []);
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
  const tripStartSchema = Yup.object().shape({
    job_order: Yup.string()
      .min(2, "Too short!")
      .max(64, "Too Long!")
      .required("Please enter job order or Trip No."),
    vehicle_no: Yup.string().required("Please enter vehicle plate number"),
    starting_km: Yup.number()
      .required("Please enter starting km")
      .typeError("please enter number"),
  });
  const tripEndSchema = Yup.object().shape({
    ending_km: Yup.number()
      .required("Please enter end km")
      .typeError("please enter numbers"),
  });
  const handleStart = (values) => {
    const currentDateTime = new Date();
    const formattedDateTime = format(currentDateTime, "yyyy-MM-dd HH:mm:ss");
    if (!tripType) {
      return Toast.show({
        type: "error",
        text1: "Please select a trip type",
      });
    }
    setIsLoading(true);
    const { latitude, longitude } = location;
    const formData = new FormData();
    formData.append("employee_id", employeeCode);
    formData.append("trip_start_time", formattedDateTime);
    formData.append("trip_type", tripType);
    formData.append("trip_start_km", values.starting_km);
    formData.append("trip_start_location", `${latitude},${longitude}`);
    formData.append("job_order", values.job_order);
    formData.append("vehicle_number", values.vehicle_no);
    formData.append("trip_status", 1);
    tripTrack(formData)
      .then(({ name }) => {
        dispatch(setTripId(name));
        dispatch(
          setStartTrip({
            startTime: new Date().toISOString(),
            tripType,
          })
        );
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Trip start failed",
          text2: "Please try again",
        });
      });
    setIsLoading(false);
  };
  const tripId = useSelector(tripIdSelect);
  const handleEnd = (values) => {
    const currentDateTime = new Date();
    const formattedDateTime = format(currentDateTime, "yyyy-MM-dd HH:mm:ss");
    const { latitude, longitude } = location;
    const formData = new FormData();
    formData.append("trip_id", tripId);
    formData.append("trip_end_km", values.ending_km);
    formData.append("trip_end_location", `${latitude},${longitude}`);
    formData.append("trip_status", 0);
    formData.append("trip_end_time", formattedDateTime);

    endTripTrack(formData)
      .then(() => {
        setTripType(null);
        dispatch(setEndTrip(new Date().toISOString()));
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Trip end failed",
          text2: "Please try again",
        });
      });
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* chevron  */}
      <View
        style={{
          width: "100%",
        }}
      >
        <View className="flex-row pb-4 pt-2 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0  pb-4 pt-2 "
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge - SIZES.xSmall}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View className="justify-self-center text-center">
            <Text className="text-lg font-medium">Trip Details</Text>
          </View>
        </View>
      </View>
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
              <View className="mt-4 flex-row">
                <TouchableOpacity
                  onPress={() => {
                    setTripType("RM");
                  }}
                  className={`items-center justify-center rounded-lg flex-grow mx-1 ${
                    tripType === "RM" ? "bg-orange-500" : "bg-orange-200"
                  }`}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                >
                  <MaterialCommunityIcons
                    name="cash-plus"
                    size={50}
                    color={"white"}
                  />
                  <Text className="font-bold text-white text-lg">RM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setTripType("NRM");
                  }}
                  className={`items-center justify-center rounded-lg flex-grow mx-1 ${
                    tripType === "NRM" ? "bg-orange-500" : "bg-orange-200"
                  }`}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                >
                  <MaterialCommunityIcons
                    name="cash-remove"
                    size={50}
                    color={"white"}
                  />
                  <Text className="font-bold text-white text-lg">NRM</Text>
                </TouchableOpacity>
              </View>
              <Formik
                initialValues={{
                  job_order: "",
                  vehicle_no: "",
                  starting_km: "",
                }}
                validationSchema={tripStartSchema}
                onSubmit={(values) => {
                  handleStart(values);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleSubmit,
                  handleChange,
                  isValid,
                  setFieldTouched,
                }) => (
                  <React.Fragment>
                    <View style={{ width: "100%", marginTop: 30 }}>
                      <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
                        <TextInput
                          value={values.job_order}
                          onChangeText={handleChange("job_order")}
                          placeholder="enter Job order/Trip No."
                          onBlur={() => setFieldTouched("job_order")}
                          style={{
                            marginTop: Platform.OS === "ios" ? -10 : 0,
                            width: 300,
                          }}
                          className=" h-12 text-lg"
                        />
                        <Ionicons
                          name="list-circle-outline"
                          size={SIZES.xLarge}
                          color={COLORS.gray2}
                        />
                      </View>
                    </View>
                    {touched.job_order && errors.job_order && (
                      <View style={{ width: "100%" }} className="left-1 mt-1">
                        <Text className="text-red-600 text-base">
                          {errors.job_order}
                        </Text>
                      </View>
                    )}
                    <View style={{ width: "100%", marginTop: 10 }}>
                      <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
                        <TextInput
                          value={values.vehicle_no}
                          onChangeText={handleChange("vehicle_no")}
                          placeholder="enter vehicle_no"
                          textContentType="none"
                          onBlur={() => setFieldTouched("vehicle_no")}
                          style={{
                            marginTop: Platform.OS === "ios" ? -10 : 0,
                            width: 300,
                          }}
                          className=" h-12 text-lg"
                        />
                        <Ionicons
                          name="car-outline"
                          size={SIZES.xLarge}
                          color={COLORS.gray2}
                        />
                      </View>
                    </View>
                    {touched.vehicle_no && errors.vehicle_no && (
                      <View style={{ width: "100%" }} className="left-1 mt-1">
                        <Text className="text-red-600 text-base">
                          {errors.vehicle_no}
                        </Text>
                      </View>
                    )}
                    <View style={{ width: "100%", marginTop: 10 }}>
                      <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
                        <TextInput
                          value={values.starting_km}
                          onChangeText={handleChange("starting_km")}
                          placeholder="enter starting km"
                          keyboardType="numbers-and-punctuation"
                          onBlur={() => setFieldTouched("starting_km")}
                          style={{
                            marginTop: Platform.OS === "ios" ? -10 : 0,
                            width: 300,
                          }}
                          className=" h-12 text-lg"
                        />
                        <Ionicons
                          name="trail-sign-outline"
                          size={SIZES.xLarge}
                          color={COLORS.gray2}
                        />
                      </View>
                    </View>
                    {touched.starting_km && errors.starting_km && (
                      <View style={{ width: "100%" }} className="left-1 mt-1">
                        <Text className="text-red-600 text-base">
                          {errors.starting_km}
                        </Text>
                      </View>
                    )}
                    <View className="mt-6 items-center">
                      <TouchableOpacity
                        disabled={!isValid}
                        onPress={handleSubmit}
                        className={`justify-center h-16 flex-row items-center space-x-2 p-3 ${
                          isValid ? " bg-blue-500" : " bg-blue-200"
                        } rounded-xl w-full`}
                      >
                        <Text className="text-2xl font-semibold text-white">
                          start trip
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                )}
              </Formik>
            </React.Fragment>
          ) : (
            <Formik
              initialValues={{
                ending_km: "",
              }}
              validationSchema={tripEndSchema}
              onSubmit={(values) => {
                handleEnd(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleSubmit,
                handleChange,
                isValid,
                setFieldTouched,
              }) => (
                <React.Fragment>
                  <View style={{ width: "100%", marginTop: 30 }}>
                    <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
                      <TextInput
                        value={values.ending_km}
                        onChangeText={handleChange("ending_km")}
                        placeholder="enter end km"
                        textContentType="none"
                        onBlur={() => setFieldTouched("ending_km")}
                        style={{
                          marginTop: Platform.OS === "ios" ? -10 : 0,
                          width: 300,
                        }}
                        className=" h-12 text-lg"
                      />
                      <Ionicons
                        name="trail-sign-outline"
                        size={SIZES.xLarge}
                        color={COLORS.gray2}
                      />
                    </View>
                  </View>
                  {touched.ending_km && errors.ending_km && (
                    <View style={{ width: "100%" }} className="left-1 mt-1">
                      <Text className="text-red-600 text-base">
                        {errors.ending_km}
                      </Text>
                    </View>
                  )}
                  <View className="mt-6 items-center">
                    <TouchableOpacity
                      disabled={!isValid}
                      onPress={handleSubmit}
                      className={`justify-center h-16 flex-row items-center space-x-2 p-3 ${
                        isValid ? "bg-red-500" : "bg-red-200"
                      } rounded-xl w-full`}
                    >
                      <Text className="text-2xl font-semibold text-white">
                        end trip
                      </Text>
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              )}
            </Formik>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripDetails;
