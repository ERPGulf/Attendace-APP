import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { WelcomeCard } from "../components/AttendenceAction";
import { Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
const AttendenceAction = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: Platform.OS == "android" && StatusBar.currentHeight,
      }}
    >
      {/* chevron  */}
      <View style={{ width: "100%" }} className="pb-3 ">
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
            <Text className="text-lg font-medium">Attendence Action</Text>
          </View>
        </View>
      </View>
      <View style={{ width: "95%" }}>
        <WelcomeCard />
      </View>
    </SafeAreaView>
  );
};

export default AttendenceAction;
