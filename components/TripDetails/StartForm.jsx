import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import debounce from "lodash.debounce";
import { COLORS, SIZES } from "../../constants";
import {
  setStartTrip,
  setTripId,
  setVehicleId,
} from "../../redux/Slices/TripDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getContracts, getVehicle, tripTrack } from "../../api/userApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { format } from "date-fns";
const StartForm = ({ setIsLoading, location, tripType }) => {
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const [isTouched, setIsTouched] = useState("");
  const [contracts, setContracts] = useState(null);
  const [contractsError, setContractsError] = useState(null);
  const [vehicles, setVehicles] = useState(null);
  const [vehiclesError, setVehiclesError] = useState(null);
  const tripStartSchema = Yup.object().shape({
    job_order: Yup.string()
      .min(1, "Too short!")
      .max(64, "Too Long!")
      .required("Please enter job order or Trip No."),
    vehicle_no: Yup.string().required("Please enter vehicle plate number"),
    starting_km: Yup.number()
      .required("Please enter starting km")
      .typeError("please enter number"),
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
    dispatch(setVehicleId(values.vehicle_no));
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
  // Debounce the API call with a delay of 250 milliseconds
  const debouncedGetContracts = debounce(async (searchTerm) => {
    try {
      const { filteredData, error } = await getContracts(searchTerm);
      if (!error) {
        return setContracts(filteredData);
      }
      setContracts(null);
      setContractsError(error);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Fetching contracts failed",
      });
    }
  }, 250);
  // Debounce the API call with a delay of 250 milliseconds
  const debouncedGetVehicles = debounce(async (searchTerm) => {
    try {
      const { filteredData, error } = await getVehicle(searchTerm);
      if (!error) {
        return setVehicles(filteredData);
      }
      setVehicles(null);
      setVehiclesError(error);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Fetching contracts failed",
      });
    }
  }, 250);
  return (
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
        setFieldValue,
      }) => (
        <React.Fragment>
          <View style={{ width: "100%", marginTop: 30 }}>
            <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
              <TextInput
                onFocus={() => setIsTouched("job_order")}
                value={values.job_order}
                onChangeText={async (text) => {
                  handleChange("job_order")(text); // Update Formik's value
                  if (!text == "") debouncedGetContracts(text);
                }}
                placeholder="enter Job order/Trip No."
                onBlur={() => setFieldTouched("job_order")}
                style={{
                  marginTop: Platform.OS === "ios" ? -10 : 0,
                  flex: 1,
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
              <Text className="text-red-600 text-base">{errors.job_order}</Text>
            </View>
          )}
          {isTouched === "job_order" && (
            <View className="border border-t-0 border-gray-200 rounded-b-lg items-center p-3">
              {contracts ? (
                contracts?.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      setFieldValue("job_order", item);
                      setIsTouched("");
                    }}
                    key={item}
                    className="w-full px-3 h-16 justify-center my-1 bg-gray-100 rounded-lg"
                  >
                    <Text className="text-lg text-gray-800">{item}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="w-full px-3 h-18 justify-center">
                  <Text className="text-base text-red-600/70">
                    {contractsError || "No job order found"}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View style={{ width: "100%", marginTop: 10 }}>
            <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
              <TextInput
                onFocus={() => setIsTouched("vehicle_no")}
                value={values.vehicle_no}
                onChangeText={async (text) => {
                  handleChange("vehicle_no")(text);
                  if (!text == "") debouncedGetVehicles(text);
                }}
                placeholder="enter vehicle_no"
                textContentType="none"
                onBlur={() => setFieldTouched("vehicle_no")}
                style={{
                  marginTop: Platform.OS === "ios" ? -10 : 0,
                  flex: 1,
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
          {isTouched === "vehicle_no" && (
            <View className="border border-t-0 border-gray-200 rounded-b-lg items-center p-2 ">
              {vehicles ? (
                vehicles?.map((item) => (
                  <TouchableOpacity
                    onPress={() => {
                      setFieldValue("vehicle_no", item.vehicle_number_plate);
                      setFieldValue("starting_km", item.odometer);
                      setIsTouched("");
                    }}
                    key={item}
                    className="w-full px-3 my-1 h-16 justify-center bg-gray-100 rounded-lg"
                  >
                    <Text className="text-lg text-gray-800">
                      {item.vehicle_number_plate}
                    </Text>
                    <Text className="text-sm text-gray-800">
                      {item.vehicle_model}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : vehiclesError ? (
                <View className="w-full px-3 h-18 justify-center">
                  <Text className="text-base text-red-600/70">
                    {vehiclesError}
                  </Text>
                </View>
              ) : (
                <View className="w-full px-3 h-18 justify-center">
                  <Text className="text-base text-gray-600/50">
                    Getting job order...
                  </Text>
                </View>
              )}
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
  );
};

export default StartForm;
