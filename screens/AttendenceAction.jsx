import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import React from "react";

const AttendenceAction = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: Platform.OS == "android" && StatusBar.currentHeight,
      }}
    >
      <View>
        <Text>Attendence Action</Text>
      </View>
    </SafeAreaView>
  );
};

export default AttendenceAction;
