import { View, Text, TouchableOpacity, Platform, TextInput } from "react-native";
import React from "react";
import { Formik } from "formik";
import { COLORS, SIZES } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { setEndTrip, tripIdSelect, vehicleIdSelect } from "../../redux/Slices/TripDetailsSlice";
import { endTripTrack } from "../../api/userApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
const EndForm = ({ location ,setIsLoading,setTripType}) => {
  const dispatch = useDispatch();
  const tripId = useSelector(tripIdSelect);
  const vehicle_no = useSelector(vehicleIdSelect);
  const handleEnd = (values) => {
    setIsLoading(true);
    const currentDateTime = new Date();
    const formattedDateTime = format(currentDateTime, "yyyy-MM-dd HH:mm:ss");
    const { latitude, longitude } = location;
    const formData = new FormData();
    formData.append("trip_id", tripId);
    formData.append("trip_end_km", values.ending_km);
    formData.append("trip_end_location", `${latitude},${longitude}`);
    formData.append("trip_status", 0);
    formData.append("vehicle_id", vehicle_no);
    formData.append("trip_end_time", formattedDateTime);
    endTripTrack(formData)
      .then(() => {
        setTripType(null);
          dispatch(setEndTrip(new Date().toISOString()));
        setIsLoading(false);
          
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Trip end failed",
          text2: "Please try again",
        });
        setIsLoading(false);
      });
  };
  const tripEndSchema = Yup.object().shape({
    ending_km: Yup.number()
      .required("Please enter end km")
      .typeError("please enter numbers"),
  });
  return (
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
                  flex: 1,
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
              <Text className="text-red-600 text-base">{errors.ending_km}</Text>
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
  );
};

export default EndForm;
