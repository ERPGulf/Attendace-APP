import { ScrollView } from "react-native";
import React, { useEffect } from "react";

import { LavaMenu, QuickAccess, WelcomeCard } from "../components/Home";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserCustomIn } from "../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setOnlyCheckIn } from "../redux/Slices/AttendenceSlice";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const Home = ({ navigation }) => {
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserStatus = async () => {
      getUserCustomIn(employeeCode)
        .then((data) => {
          const jsonData = data
          const [{ custom_in }] = jsonData.data;
          custom_in === 0
            ? dispatch(setOnlyCheckIn(false))
            : dispatch(setOnlyCheckIn(true));
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Status failed",
            text2: "Getting user status failed, Please try again",
          });
        });
    };
    getUserStatus()
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
      }}
      className="bg-gray-100"
    >
      <ScrollView
        style={{ width: "95%" }}
        contentContainerStyle={{ justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        StickyHeaderComponent={WelcomeCard}
        alwaysBounceVertical
        automaticallyAdjustContentInsets
      >
        <WelcomeCard />
        <QuickAccess />
        <LavaMenu navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
